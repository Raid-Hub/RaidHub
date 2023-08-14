import prisma from "../prisma"

type BungieToken = {
    value: string
    expires: number
}
export async function updateBungieAccessTokens(
    destinyMembershipId: string,
    tokens: {
        access: BungieToken
        refresh: BungieToken
    }
) {
    const prepare = (token: BungieToken) => ({
        value: token.value,
        expires: new Date(token.expires)
    })

    return prisma.user.update({
        where: {
            destinyMembershipId
        },
        data: {
            bungieAccessToken: {
                connectOrCreate: {
                    where: { destinyMembershipId },
                    create: prepare(tokens.access)
                }
            },
            bungieRefreshToken: {
                connectOrCreate: {
                    where: { destinyMembershipId },
                    create: prepare(tokens.refresh)
                }
            }
        },
        include: {
            bungieAccessToken: true,
            bungieRefreshToken: true
        }
    })
}
