import prisma from "~/server/prisma"
import { BungieToken } from ".."

export async function updateBungieAccessTokens({
    bungieMembershipId,
    access,
    refresh
}: {
    bungieMembershipId: string
    access: BungieToken
    refresh: BungieToken
}) {
    const prepareTokenUpdate = (token: BungieToken) => ({
        where: {
            bungieMembershipId
        },
        select: {
            user: {
                select: {
                    id: true
                }
            }
        },
        create: {
            id: crypto.randomUUID(),
            value: token.value,
            expires: token.expires,
            user: {
                connect: {
                    bungieMembershipId
                }
            }
        },
        update: {
            id: crypto.randomUUID(),
            value: token.value,
            expires: token.expires
        }
    })

    const prepareAccountUpdate = (
        key: "accessToken" | "refreshToken",
        token: BungieToken,
        userId: string
    ) => ({
        where: {
            provider_userId: {
                provider: "bungie",
                userId: userId
            }
        },
        data: {
            [key]: token.value,
            expiresAt: token.expires.getTime() / 1000
        }
    })

    await Promise.all([
        prisma.accessToken
            .delete({ where: { bungieMembershipId: bungieMembershipId } })
            .catch(console.error)
            .then(() => prisma.accessToken.upsert(prepareTokenUpdate(access)))
            .then(({ user }) =>
                prisma.account.update(prepareAccountUpdate("accessToken", access, user.id))
            ),
        prisma.refreshToken
            .delete({ where: { bungieMembershipId: bungieMembershipId } })
            .catch(console.error)
            .then(() => prisma.refreshToken.upsert(prepareTokenUpdate(refresh)))
            .then(({ user }) =>
                prisma.account.update(prepareAccountUpdate("refreshToken", refresh, user.id))
            )
    ])
}
