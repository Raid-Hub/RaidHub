import prisma from "../prisma"

type BungieToken = {
    value: string
    expires: number
}

const prepare = (token: BungieToken) => ({
    create: {
        value: token.value,
        expires: new Date(token.expires)
    }
})

export async function updateBungieAccessTokens({
    bungieMembershipId,
    access,
    refresh
}: {
    bungieMembershipId: string
    access: BungieToken
    refresh: BungieToken
}) {
    await Promise.all([
        prisma.accessToken.delete({ where: { bungieMembershipId } }).catch(console.error),
        prisma.refreshToken.delete({ where: { bungieMembershipId } }).catch(console.error)
    ])

    return prisma.user.update({
        where: {
            bungieMembershipId
        },
        data: {
            bungieAccessToken: prepare(access),
            bungieRefreshToken: prepare(refresh)
        },
        select: {
            bungieMembershipId: true,
            destinyMembershipId: true,
            bungieAccessToken: true,
            bungieRefreshToken: true
        }
    })
}
