import { getAccessTokenFromRefreshToken } from "bungie-net-core/lib/auth"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { CallbacksOptions, Session } from "next-auth/core/types"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"
import { AdapterUser } from "next-auth/adapters"

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
            const tokens = await getAccessTokenFromRefreshToken(user.bungieRefreshToken.value)

            updateBungieAccessTokens(tokens)

            return {
                ...session,
                user: {
                    ...newUser,
                    bungieAccessToken: {
                        value: tokens.access.value,
                        expires: tokens.access.expires
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
