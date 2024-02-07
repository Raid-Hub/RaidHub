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
            expires: string
        }
        raidHubAccessToken?: {
            value: string
            expires: string
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
    user: AdapterUser & {
        bungieAccount: BungieAccount
        raidHubAccessToken: {
            value: string
            expiresAt: Date
        } | null
    }
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
