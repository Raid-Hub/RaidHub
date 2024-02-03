import "server-only"

import type { BungieFetchConfig } from "bungie-net-core"
import { refreshAuthorization } from "bungie-net-core/auth"
import { Session } from "next-auth"
import { SessionAndUserData } from "./types"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"

export const sessionCallback = async ({
    session,
    user: { bungieAccount, ...user }
}: SessionAndUserData) => {
    // TODO: add raidhub access token
    if (
        bungieAccount.expiresAt &&
        bungieAccount.accessToken &&
        Date.now() < bungieAccount.expiresAt * 1000
    ) {
        // If user access token has not expired yet
        return {
            ...session,
            bungieAccessToken: {
                value: bungieAccount.accessToken,
                expires: new Date(bungieAccount.expiresAt * 1000)
            },
            user
        } satisfies Session
    } else if (
        bungieAccount.refreshToken &&
        (!bungieAccount.refreshExpiresAt || Date.now() < bungieAccount.refreshExpiresAt * 1000)
    ) {
        // User access token has expired, but refresh token has not
        try {
            const tokens = await refreshAuthorization(
                bungieAccount.refreshToken,
                {
                    client_id: process.env.BUNGIE_CLIENT_ID!,
                    client_secret: process.env.BUNGIE_CLIENT_SECRET!
                },
                {
                    fetch: async <T>(config: BungieFetchConfig) => {
                        const res = await fetch(config.url, config)
                        if (!res.ok) {
                            throw await res.text()
                        } else {
                            return res.json() as T
                        }
                    }
                }
            )

            await updateBungieAccessTokens({
                userId: user.id,
                access: {
                    value: tokens.access_token,
                    expires: new Date(Date.now() + tokens.expires_in * 1000)
                },
                refresh: {
                    value: tokens.refresh_token,
                    expires: new Date(Date.now() + tokens.refresh_expires_in * 1000)
                }
            })

            return {
                ...session,
                user,
                bungieAccessToken: {
                    value: tokens.access_token,
                    expires: new Date(Date.now() + tokens.expires_in * 1000)
                }
            } satisfies Session
        } catch (e: any) {
            if (
                e.response?.error_description === "SystemDisabled" ||
                e.response?.error_description === "Error Response for Shard Relay."
            ) {
                return {
                    ...session,
                    user,
                    error: "BungieAPIOffline"
                } satisfies Session
            } else {
                throw e
                // TODO
                // console.error(e)
                // return {
                //     ...session,
                //     user,
                //     error: "AccessTokenError"
                // } satisfies Session
            }
        }
    } else {
        return {
            ...session,
            user,
            error: "ExpiredRefreshTokenError"
        } satisfies Session
    }
}
