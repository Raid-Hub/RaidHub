import prisma from "../../../server/prisma"
import { v4 } from "uuid"

type BungieToken = {
    value: string
    expires: number
}

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
        id: v4(),
        value: token.value,
        expires: new Date(token.expires)
    })

    return prisma.user.update({
        where: {
            bungieMembershipId
        },
        data: {
            bungieAccessToken: {
                update: {
                    data: prepare(access)
                }
            },
            bungieRefreshToken: {
                update: {
                    data: prepare(refresh)
                }
            }
        },
        include: {
            bungieAccessToken: true,
            bungieRefreshToken: true
        }
    })
}
