import { Session, User } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/models"
import { DefaultSession } from "next-auth"
import { AdapterUser } from "next-auth/adapters"

declare module "next-auth" {
    interface Session extends DefaultSession {
        error?: AuthError
        user: AdapterUser
        bungieAccessToken?: {
            value: string
            expires: Date
        }
        raidHubAccessToken?: {
            value: string
            expires: Date
        }
        expires: Date
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends User {
        image: string
        name: string
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    }
}

export type SessionAndUserData = {
    session: Session
    user: AdapterUser & { bungieAccount: BungieAccount }
}

export type AuthToken = {
    value: string
    expires: Date
}

export type BungieAccount = {
    refreshToken: string | null
    accessToken: string | null
    expiresAt: number | null
    refreshExpiresAt: number | null
}

export type AuthError = "BungieAPIOffline" | "AccessTokenError" | "ExpiredRefreshTokenError"
