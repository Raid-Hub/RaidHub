import { z } from "zod"
import { User as PrismaUser, Prisma } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/models"

export const zModifiableUser = z.object({
    name: z.string(),
    image: z.string().url(),
    pinnedActivityId: z.nullable(z.string()),
    profileDecoration: z.nullable(z.string().max(500, "CSS String too long, maximum length: 500"))
})

// rather than importing the full enum, we make it ourselves
const BungieMembershipEnum = z.nativeEnum({
    None: 0,
    TigerXbox: 1,
    TigerPsn: 2,
    TigerSteam: 3,
    TigerBlizzard: 4,
    TigerStadia: 5,
    TigerEgs: 6,
    TigerDemon: 10,
    BungieNext: 254,
    All: -1
})

export const zUser = z
    .object({
        destinyMembershipId: z.string(),
        destinyMembershipType: BungieMembershipEnum,
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
