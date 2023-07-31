import { BungieTokens } from "bungie-net-core/lib/auth"
import prisma from "../prisma"

export async function updateBungieAccessTokens(
    userId: string,
    tokens: Omit<BungieTokens, "bungieMembershipId">
) {
    return prisma.user.update({
        where: {
            id: userId
        },
        data: {
            bungie_access_token: tokens.access.value,
            bungie_access_expires_at: new Date(tokens.access.expires),
            bungie_refresh_token: tokens.refresh.value,
            bungie_refresh_expires_at: new Date(tokens.refresh.expires)
        }
    })
}
