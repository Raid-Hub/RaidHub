import { type UserMembershipData } from "bungie-net-core/models"
import { prisma } from "~/server/prisma"

// TODO: we should add this as a trpc procedure to make it easier to use
// in other parts of the app
export const updateDestinyProfiles = async (data: UserMembershipData) => {
    const applicableMemberships = data.destinyMemberships.filter(
        m => m.applicableMembershipTypes.length > 0
    )

    const primaryDestinyMembershipId =
        data.primaryMembershipId ?? applicableMemberships[0]?.membershipId

    if (!primaryDestinyMembershipId) throw new Error("No primary membership found")

    const [, ...profiles] = await prisma.$transaction([
        prisma.profile.deleteMany({
            where: {
                bungieMembershipId: data.bungieNetUser.membershipId,
                vanity: null
            }
        }),
        ...applicableMemberships.map(membership =>
            prisma.profile.upsert({
                create: {
                    destinyMembershipId: membership.membershipId,
                    destinyMembershipType: membership.membershipType,
                    isPrimary: membership.membershipId === primaryDestinyMembershipId,
                    bungieMembershipId: data.bungieNetUser.membershipId
                },
                update: {
                    bungieMembershipId: data.bungieNetUser.membershipId,
                    isPrimary: membership.membershipId === primaryDestinyMembershipId
                },
                where: {
                    destinyMembershipId: membership.membershipId
                },
                select: {
                    isPrimary: true,
                    destinyMembershipId: true,
                    destinyMembershipType: true,
                    vanity: true
                }
            })
        )
    ])

    return profiles
}
