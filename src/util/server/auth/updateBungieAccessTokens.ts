import { BungieToken } from "bungie-net-core/lib/auth"
import prisma from "../prisma"
import { v4 } from "uuid"

export async function updateBungieAccessTokens({
    bungieMembershipId,
    access,
    refresh
}: {
    bungieMembershipId: string
    access: Pick<BungieToken, "value" | "expires">
    refresh: Pick<BungieToken, "value" | "expires">
}) {
    const prepare = (token: Pick<BungieToken, "value" | "expires">) => ({
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
