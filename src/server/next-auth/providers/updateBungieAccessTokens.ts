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
        data: {
            id: crypto.randomUUID(),
            value: token.value,
            expires: token.expires
        },
        select: {
            user: {
                select: {
                    id: true
                }
            }
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
            [key]: token.value
        }
    })

    await Promise.all([
        prisma.accessToken
            .delete({ where: { bungieMembershipId: bungieMembershipId } })
            .catch(console.error)
            .then(() => prisma.accessToken.update(prepareTokenUpdate(access)))
            .then(({ user }) =>
                prisma.account.update(prepareAccountUpdate("accessToken", access, user.id))
            ),
        prisma.refreshToken
            .delete({ where: { bungieMembershipId: bungieMembershipId } })
            .catch(console.error)
            .then(() => prisma.refreshToken.update(prepareTokenUpdate(refresh)))
            .then(({ user }) =>
                prisma.account.update(prepareAccountUpdate("refreshToken", access, user.id))
            )
    ])
}
