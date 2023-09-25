import { z } from "zod"
import { User as PrismaUser, Profile as PrismaProfile, Prisma, Role } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/models"
import { UrlPathsToRaid } from "./destiny/raidUtils"

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

export const zProfile = z.object({
    destinyMembershipId: z.string(),
    speedrunUsername: z.nullable(z.string()),
    bungieUsername: z.nullable(z.string()),
    discordUsername: z.nullable(z.string()),
    twitchUsername: z.nullable(z.string()),
    destinyMembershipType: BungieMembershipEnum,
    twitterUsername: z.nullable(z.string()),
    pinnedActivityId: z.nullable(z.string().regex(/^\d+$/)),
    profileDecoration: z.nullable(z.string().max(500, "CSS String too long, maximum length: 500"))
}) satisfies {
    _output: Omit<PrismaProfile, "id">
}

export const zUser = z.object({
    name: z.string(),
    image: z.string(),
    destinyMembershipId: z.string(),
    destinyMembershipType: BungieMembershipEnum,
    bungieMembershipId: z.string(),
    role: z.nativeEnum(Role),
    email: z.string(),
    emailVerified: z.nullable(z.date())
}) satisfies {
    _output: Omit<PrismaUser, "id">
}

export const zModifiableUser = z
    .object({
        name: z.string(),
        image: z.string()
    })
    .partial() satisfies {
    _output: Partial<z.infer<typeof zUser>>
}

export const zModifiableProfile = z
    .object({
        pinnedActivityId: z.nullable(z.string().regex(/^\d+$/)),
        profileDecoration: z.nullable(
            z.string().max(500, "CSS String too long, maximum length: 500")
        )
    })
    .partial() satisfies {
    _output: Partial<z.infer<typeof zProfile>>
}

export const zUsernames = z.object({
    bungieUsername: z.string().nullable(),
    discordUsername: z.string().nullable(),
    twitterUsername: z.string().nullable(),
    twitchUsername: z.string().nullable()
}) satisfies {
    _output: Partial<z.infer<typeof zProfile>>
}

export const zUniqueDestinyProfile = z.object({
    destinyMembershipType: z.union([
        BungieMembershipEnum,
        z
            .string()
            .regex(/^\d+$/)
            .transform(str => BungieMembershipEnum.parse(Number(str)))
    ]),
    destinyMembershipId: z.string().regex(/^\d+$/)
}) satisfies {
    _output: Prisma.ProfileDestinyMembershipIdDestinyMembershipTypeCompoundUniqueInput & {
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    }
}

export const zRaidURIComponent = z.object({
    raid: z
        .string()
        .refine((key): key is keyof typeof UrlPathsToRaid => key in UrlPathsToRaid)
        .transform(key => UrlPathsToRaid[key])
})

export const zCreateVanity = z.object({
    destinyMembershipId: z.string().transform(s => s.toLowerCase()),
    destinyMembershipType: BungieMembershipEnum,
    string: z.string()
})
