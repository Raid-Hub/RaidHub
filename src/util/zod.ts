import { type Prisma } from "@prisma/client"
import { type BungieMembershipType } from "bungie-net-core/models"
import { z } from "zod"

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
    name: z.string(),
    image: z.string(),
    vanity: z.string().nullable().optional(),
    destinyMembershipId: z.string(),
    destinyMembershipType: BungieMembershipEnum,
    pinnedActivityId: z.string().regex(/^\d+$/).nullable().optional(),
    profileDecoration: z
        .string()
        .max(500, "CSS String too long, maximum length: 500")
        .nullable()
        .optional()
}) satisfies {
    _output: Omit<Prisma.ProfileCreateInput, "user">
}

export const zUser = z.object({
    bungieMembershipId: z.string(),
    role: z.enum(["USER", "ADMIN"]),
    email: z.string().nullable().default(null),
    emailVerified: z.nullable(z.date())
}) satisfies {
    _output: Prisma.UserCreateInput
}

const zProfileDecoration = z.string().regex(/^#[A-Fa-f0-9]{8}$/, "Invalid color code")

export const zModifiableProfile = z
    .object({
        pinnedActivityId: z.nullable(z.string().regex(/^\d+$/)),
        profileDecoration: zProfileDecoration.nullable()
    })
    .partial() satisfies {
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
    _output: {
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    }
}

export const zCreateVanity = z.object({
    destinyMembershipId: z.string(),
    destinyMembershipType: BungieMembershipEnum,
    string: z.string().transform(s => s.toLowerCase())
})

export const zDeleteVanity = z.object({
    vanity: z.string().toLowerCase()
})

export const numberString = z.coerce.string().regex(/^\d+$/)
export const booleanString = z
    .string()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .transform(s => JSON.parse(s))
    .pipe(z.boolean())
