import { CallbacksOptions, Session } from "next-auth/core/types"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"
import { AdapterUser } from "next-auth/adapters"
import { refreshAuthorization } from "bungie-net-core/auth"
import { BungieMembershipType } from "bungie-net-core/models"
import { BungieFetchConfig } from "bungie-net-core"
import { Role } from "@prisma/client"

export type SessionUser = {
    id: string
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    name: string
    image: string
    role: Role
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
        role: user.role,
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
    } else if (user.bungieRefreshToken && Date.now() < user.bungieRefreshToken.expires.getTime()) {
        try {
            const tokens = await refreshAuthorization(
                user.bungieRefreshToken.value,
                {
                    client_id: process.env.BUNGIE_CLIENT_ID!,
                    client_secret: process.env.BUNGIE_CLIENT_SECRET!
                },
                {
                    fetch: async <T>(config: BungieFetchConfig) =>
                        fetch(config.url, config).then(res => res.json()) as T
                }
            )

            await updateBungieAccessTokens({
                bungieMembershipId: tokens.membership_id,
                access: {
                    value: tokens.access_token,
                    expires: Date.now() + tokens.expires_in * 1000
                },
                refresh: {
                    value: tokens.refresh_token,
                    expires: Date.now() + tokens.refresh_expires_in * 1000
                }
            }).catch(console.error)

            return {
                ...session,
                user: {
                    ...newUser,
                    bungieAccessToken: {
                        value: tokens.access_token,
                        expires: Date.now() + tokens.expires_in * 1000
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
