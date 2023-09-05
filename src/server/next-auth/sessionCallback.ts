import { CallbacksOptions, Session } from "next-auth/core/types"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"
import { AdapterUser } from "next-auth/adapters"
import { refreshAuthorization } from "bungie-net-core/auth"
import { BungieMembershipType } from "bungie-net-core/models"
import { BungieFetchConfig } from "bungie-net-core"

export type SessionUser = {
    id: string
    destinyMembershipId: string | null
    destinyMembershipType: BungieMembershipType | null
    name: string
    bungie: string | null
    twitch: string | null
    discord: string | null
    twitter: string | null
    image: string
    bungieAccessToken?: {
        value: string
        expires: number
    }
}

function sessionUser(user: AdapterUser): SessionUser {
    return {
        id: user.id,
        destinyMembershipId: user.destinyMembershipId,
        destinyMembershipType: user.destinyMembershipType,
        image: user.image,
        name: user.name,
        bungie: user.bungieUsername,
        twitch: user.twitchUsername,
        twitter: user.twitterUsername,
        discord: user.discordUsername,
        bungieAccessToken: user.bungieAccessToken
            ? {
                  value: user.bungieAccessToken.value,
                  expires: user.bungieAccessToken.expires.getTime()
              }
            : undefined
    }
}

export const sessionCallback: CallbacksOptions["session"] = async ({ session, user }) => {
    const newUser = sessionUser(user)

    if (!user.bungieAccessToken) {
        // If user is not authenticated with Bungie
        return {
            ...session,
            user: newUser
        } satisfies Session
    } else if (Date.now() < user.bungieAccessToken.expires.getTime()) {
        // If user access token has not expired yet
        return {
            ...session,
            user: newUser
        } satisfies Session
    } else if (user.bungieRefreshToken && Date.now() < user.bungieRefreshToken?.expires.getTime()) {
        try {
            const tokens = await refreshAuthorization(
                user.bungieRefreshToken.value,
                {
                    client_id: process.env.BUNGIE_CLIENT_ID!,
                    client_secret: process.env.BUNGIE_CLIENT_SECRET!
                },
                {
                    async fetch<T>(config: BungieFetchConfig) {
                        return fetch(config.url, config).then(res => res.json()) as T
                    }
                }
            )

            updateBungieAccessTokens({
                bungieMembershipId: tokens.membership_id,
                access: {
                    value: tokens.access_token,
                    expires: tokens.expires_in * 1000
                },
                refresh: {
                    value: tokens.refresh_token,
                    expires: tokens.refresh_expires_in * 1000
                }
            })

            return {
                ...session,
                user: {
                    ...newUser,
                    bungieAccessToken: {
                        value: tokens.access_token,
                        expires: tokens.expires_in * 1000
                    }
                }
            } satisfies Session
        } catch (e: any) {
            if (e.response?.error_description === "SystemDisabled") {
                return {
                    ...session,
                    user: newUser,
                    error: "BungieAPIOffline"
                } satisfies Session
            } else {
                console.error(e)
                return {
                    ...session,
                    user: newUser,
                    error: "AccessTokenError"
                } satisfies Session
            }
        }
    } else {
        return {
            ...session,
            user: newUser,
            error: "ExpiredRefreshTokenError"
        } satisfies Session
    }
}
