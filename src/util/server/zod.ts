import { z } from "zod"
import { User as PrismaUser, Prisma } from "@prisma/client"
import { BungieMembershipType as BungieMembership } from "bungie-net-core/enums"
import { BungieMembershipType } from "bungie-net-core/models"

export const zModifiableUser = z.object({
    name: z.string(),
    image: z.string().url(),
    pinnedActivityId: z.nullable(z.string()),
    profileDecoration: z.nullable(z.string().max(500, "CSS String too long, maximum length: 500"))
})

export const zUser = z
    .object({
        destinyMembershipId: z.string(),
        destinyMembershipType: z.nativeEnum(BungieMembership),
        bungieMembershipId: z.string(),
        bungieUsername: z.nullable(z.string()),
        discordUsername: z.nullable(z.string()),
        twitchUsername: z.nullable(z.string()),
        twitterUsername: z.nullable(z.string()),
        email: z.string(),
        emailVerified: z.nullable(z.date())
    })
    .merge(zModifiableUser) satisfies {
    _output: Omit<PrismaUser, "id">
}

const BungieMembershipEnum = z.nativeEnum(BungieMembership)
export const zUniqueDestinyProfile = z.object({
    destinyMembershipType: z.union([
        BungieMembershipEnum,
        z
            .string()
            .regex(/^\d+$/)
            .transform(str => BungieMembershipEnum.parse(Number(str)))
    ]),
    destinyMembershipId: z.string()
}) satisfies {
    _output: Prisma.VanityDestinyMembershipIdDestinyMembershipTypeCompoundUniqueInput & {
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    }
}
