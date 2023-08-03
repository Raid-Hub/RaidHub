import { z } from "zod"
import { User as PrismaUser } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/lib/models"

export const zUser = z.object({
    destiny_membership_type: z.nativeEnum(BungieMembershipType),
    destiny_membership_id: z.string(),
    name: z.string(),
    image: z.string().url(),
    bungie_username: z.nullable(z.string()),
    discord_username: z.nullable(z.string()),
    twitch_username: z.nullable(z.string()),
    twitter_username: z.nullable(z.string()),
    bungie_access_token: z.nullable(z.string()),
    bungie_access_expires_at: z.nullable(z.date()),
    bungie_refresh_token: z.nullable(z.string()),
    bungie_refresh_expires_at: z.nullable(z.date()),
    email: z.nullable(z.string()),
    pinned_activity_id: z.nullable(z.string()),
    profile_decoration: z.nullable(z.string())
}) satisfies {
    _output: Omit<PrismaUser, "id">
}
