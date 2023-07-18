import { z } from "zod"
import { User as PrismaUser } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/lib/models"

export type PartialStruct<T extends { id: any }> = Partial<T> & Pick<T, "id">

export const zUser = z.object({
    id: z.string().optional(),
    destinyMembershipType: z.nullable(z.nativeEnum(BungieMembershipType)).optional(),
    destinyMembershipId: z.nullable(z.string()).optional(),
    name: z.nullable(z.string()).optional(),
    image: z.nullable(z.string().url()).optional(),
    bungie_access_token: z.nullable(z.string()).optional(),
    bungie_access_expires_at: z.nullable(z.date()).optional(),
    bungie_refresh_token: z.nullable(z.string()).optional(),
    bungie_refresh_expires_at: z.nullable(z.date()).optional(),
    email: z.nullable(z.string()).optional(),
    emailVerified: z.nullable(z.date()).optional()
}) satisfies {
    _output: Partial<PrismaUser>
}
