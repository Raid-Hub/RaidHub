import { BungieToken } from "bungie-net-core/lib/auth"
import prisma from "../prisma"

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
