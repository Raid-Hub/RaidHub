import { AccessToken, User as PrismaUser, RefreshToken } from "@prisma/client"
import NextAuth from "next-auth/next"
import { DefaultSession } from "next-auth"
import { SessionUser } from "~/server/next-auth/sessionCallback"
import { authOptions } from "~/server/next-auth"

type AuthError = "BungieAPIOffline" | "AccessTokenError" | "ExpiredRefreshTokenError"

declare module "next-auth" {
    interface Session extends DefaultSession {
        error?: AuthError
        user: SessionUser
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends PrismaUser {
        name: string
        image: string
        bungieAccessToken: AccessToken | null
        bungieRefreshToken: RefreshToken | null
    }
}

export default NextAuth(authOptions)
