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

export const numberString = z.coerce.string().regex(/^\d+$/)
export const booleanString = z
    .string()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .transform(s => JSON.parse(s))
    .pipe(z.boolean())
