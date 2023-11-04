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
    return Promise.all([
        prisma.accessToken.delete({ where: { bungieMembershipId } }),
        prisma.refreshToken.delete({ where: { bungieMembershipId } })
    ]).then(removed =>
        prisma.user.update({
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
    )
}
