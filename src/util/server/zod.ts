import { z } from "zod"
import { User as PrismaUser, Prisma } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/lib/models"

export const zUser = z.object({
    destinyMembershipId: z.string(),
    destinyMembershipType: z.nativeEnum(BungieMembershipType),
    bungieMembershipId: z.string(),
    name: z.string(),
    image: z.string().url(),
    bungieUsername: z.nullable(z.string()),
    discordUsername: z.nullable(z.string()),
    twitchUsername: z.nullable(z.string()),
    twitterUsername: z.nullable(z.string()),
    email: z.string(),
    pinnedActivityId: z.nullable(z.string()),
    profileDecoration: z.nullable(z.string().max(500, "CSS String too long, maximum length: 500")),
    emailVerified: z.nullable(z.date())
}) satisfies {
    _output: Omit<PrismaUser, "id">
}

export const zUniqueDestinyProfile = z.object({
    destinyMembershipType: z.union([
        z.nativeEnum(BungieMembershipType),
        z.string().regex(/^\d+$/).transform(Number)
    ]),
    destinyMembershipId: z.string()
}) satisfies {
    _output: Prisma.VanityDestinyMembershipIdDestinyMembershipTypeCompoundUniqueInput & {
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    }
}
