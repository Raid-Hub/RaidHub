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
    const prepare = (token: BungieToken) => ({
        data: {
            value: token.value,
            expires: token.expires,
            user: {
                connect: {
                    bungieMembershipId
                }
            }
        }
    })

    await Promise.all([
        prisma.accessToken
            .delete({ where: { bungieMembershipId: bungieMembershipId } })
            .then(() => prisma.accessToken.create(prepare(access))),
        prisma.refreshToken
            .delete({ where: { bungieMembershipId: bungieMembershipId } })
            .then(() => prisma.accessToken.create(prepare(refresh)))
    ])
}
