import "server-only"

import type { BungieFetchConfig } from "bungie-net-core"
import { refreshAuthorization } from "bungie-net-core/auth"
import { type Session } from "next-auth"
import { postRaidHubApi } from "~/services/raidhub/common"
import { type RaidHubTokenResponse } from "~/services/raidhub/types"
import { type SessionAndUserData } from "./types"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"

export const sessionCallback = async ({
    session,
    user: { bungieAccount, raidHubAccessToken, ...user }
}: SessionAndUserData) => {
    let raidhubToken: Promise<RaidHubTokenResponse | undefined> = Promise.resolve(undefined)
    if (
        user.role === "ADMIN" &&
        (!raidHubAccessToken || Date.now() > raidHubAccessToken.expiresAt.getTime())
    ) {
        raidhubToken = postRaidHubApi("/authorize", null, {
            clientSecret: process.env.RAIDHUB_CLIENT_SECRET!
        }).catch(e => {
            console.error(e)
            return undefined
        })
    }

    if (
        bungieAccount.expiresAt &&
        bungieAccount.accessToken &&
        Date.now() < (bungieAccount.expiresAt - 300) * 1000 // give a 5 minute buffer where it's not expired but we should refresh
    ) {
        // If user access token has not expired yet
        return {
            ...session,
            user,
            bungieAccessToken: {
                value: bungieAccount.accessToken,
                expires: new Date(bungieAccount.expiresAt * 1000).toISOString()
            },
            raidHubAccessToken: await raidhubToken
        } satisfies Session
    } else if (
        bungieAccount.refreshToken &&
        (!bungieAccount.refreshExpiresAt || Date.now() < bungieAccount.refreshExpiresAt * 1000)
    ) {
        // User access token has expired, but refresh token has not
        try {
            const bungieTokens = await refreshAuthorization(
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
                    value: bungieTokens.access_token,
                    expires: new Date(Date.now() + bungieTokens.expires_in * 1000)
                },
                refresh: {
                    value: bungieTokens.refresh_token,
                    expires: new Date(Date.now() + bungieTokens.refresh_expires_in * 1000)
                }
            })

            return {
                ...session,
                user,
                bungieAccessToken: {
                    value: bungieTokens.access_token,
                    expires: new Date(Date.now() + bungieTokens.expires_in * 1000).toISOString()
                },
                raidHubAccessToken: await raidhubToken
            } satisfies Session
        } catch (e) {
            if (
                // @ts-expect-error Error typing...
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                e.response?.error_description === "SystemDisabled" ||
                // @ts-expect-error Error typing...
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                e.response?.error_description === "Error Response for Shard Relay."
            ) {
                return {
                    ...session,
                    user,
                    error: "BungieAPIOffline"
                } satisfies Session
            } else {
                console.error(e)
                return {
                    ...session,
                    user,
                    error: "AccessTokenError"
                } satisfies Session
            }
        }
    } else {
        return {
            ...session,
            user,
            raidHubAccessToken: await raidhubToken,
            error: "ExpiredRefreshTokenError"
        } satisfies Session
    }
}
