import prisma from "~/server/prisma"
import { BungieToken } from ".."

export async function updateBungieAccessTokens({
    userId,
    access,
    refresh
}: {
    userId: string
    access: BungieToken
    refresh: BungieToken
}) {
    await prisma.account.update({
        where: {
            provider_userId: {
                provider: "bungie",
                userId: userId
            }
        },
        data: {
            accessToken: access.value,
            expiresAt: access.expires.getTime() / 1000,
            refreshToken: refresh.value,
            refreshExpiresAt: refresh.expires.getTime() / 1000
        }
    })
}
