import { User } from "@prisma/client"
import { getAccessTokenFromRefreshToken } from "bungie-net-core/lib/auth"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { CallbacksOptions, Session } from "next-auth/core/types"
import prisma from "../prisma"
import { AdapterUser } from "next-auth/adapters"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"

export type SessionUser = {
    id: string
    destinyMembershipId: string | null
    destinyMembershipType: BungieMembershipType | null
    name: string | null
    bungie: string | null
    twitch: string | null
    discord: string | null
    twitter: string | null
    image: string | null
    bungieAccessToken?: {
        value: string
        expires: number
    }
}

function sessionUser(user: User): SessionUser {
    return {
        id: user.id,
        destinyMembershipId: user.destiny_membership_id,
        destinyMembershipType: user.destiny_membership_type,
        image: user.image,
        name: user.name,
        bungie: user.bungie_username,
        twitch: user.twitch_username,
        twitter: user.twitter_username,
        discord: user.discord_username,
        bungieAccessToken:
            user.bungie_access_token && user.bungie_access_expires_at
                ? {
                      value: user.bungie_access_token,
                      expires: user.bungie_access_expires_at.getTime()
                  }
                : undefined
    }
}

export const sessionCallback: CallbacksOptions["session"] = async ({ session, user }) => {
    const newUser = sessionUser(user as User)

    if (
        !user.bungie_access_expires_at ||
        !user.bungie_refresh_expires_at ||
        !user.bungie_refresh_token
    ) {
        console.log("a")
        // If user is not authenticated with Bungie
        return {
            ...session,
            user: newUser
        } satisfies Session
    } else if (Date.now() < user.bungie_access_expires_at.getTime()) {
        // If user access token has not expired yet
        console.log("b")
        return {
            ...session,
            user: newUser
        } satisfies Session
    } else if (
        Date.now() < 0 //user.bungie_refresh_expires_at.getTime()) {
    ) {
        console.log("c")
        try {
            const tokens = await getAccessTokenFromRefreshToken(user.bungie_refresh_token)
            const updatedUser = await updateBungieAccessTokens(user.id, tokens)

            return {
                ...session,
                user: {
                    ...sessionUser(updatedUser),
                    bungieAccessToken: {
                        value: tokens.access.value,
                        expires: tokens.access.expires
                    }
                }
            } satisfies Session
        } catch (e) {
            console.error(e)
            return {
                ...session,
                user: newUser,
                error: "RefreshAccessTokenError" as const
            } satisfies Session
        }
    } else {
        return {
            ...session,
            user: newUser,
            error: "ExpiredRefreshTokenError" as const
        } satisfies Session
    }
}
