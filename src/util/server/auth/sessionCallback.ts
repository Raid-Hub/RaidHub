import { User } from "@prisma/client"
import { getAccessTokenFromRefreshToken } from "bungie-net-core/lib/auth"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { Session } from "next-auth/core/types"
import prisma from "../prisma"
import { AdapterUser } from "next-auth/adapters"

export type SessionUser = {
    id: string
    destinyMembershipId: string | null
    destinyMembershipType: BungieMembershipType | null
    name: string | null
    image: string | null
    bungieAccessToken?: {
        value: string
        expires: number
    }
}

function sessionUser(user: User): SessionUser {
    return {
        id: user.id,
        destinyMembershipId: user.destinyMembershipId,
        destinyMembershipType: user.destinyMembershipType,
        image: user.image,
        name: user.name,
        bungieAccessToken:
            user.bungie_access_token && user.bungie_access_expires_at
                ? {
                      value: user.bungie_access_token,
                      expires: user.bungie_access_expires_at.getTime()
                  }
                : undefined
    }
}

export async function sessionCallback({ session, user }: { session: Session; user: AdapterUser }) {
    const newUser = sessionUser(user as User)
    if (
        !user.bungie_access_expires_at ||
        !user.bungie_refresh_expires_at ||
        !user.bungie_refresh_token
    ) {
        // If user is not authenticated with Bungie
        return {
            ...session,
            user: newUser
        } satisfies Session
    } else if (Date.now() < user.bungie_access_expires_at.getTime()) {
        // If user access token has not expired yet
        return {
            ...session,
            user: newUser
        } satisfies Session
    } else if (Date.now() < user.bungie_refresh_expires_at.getTime()) {
        console.log("refreshing token")
        try {
            const tokens = await getAccessTokenFromRefreshToken(user.bungie_refresh_token)

            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    bungie_access_token: tokens.access.value,
                    bungie_access_expires_at: new Date(tokens.access.expires),
                    bungie_refresh_token: tokens.refresh.value,
                    bungie_refresh_expires_at: new Date(tokens.refresh.expires)
                }
            })

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
