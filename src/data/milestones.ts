import type { ListedRaid, SunsetRaid } from "~/types/raidhub-api"
import { Raid } from "./raid"

export const RaidMileStones = {
    [Raid.LAST_WISH]: 3181387331,
    [Raid.GARDEN_OF_SALVATION]: 2712317338,
    [Raid.DEEP_STONE_CRYPT]: 541780856,
    [Raid.VAULT_OF_GLASS]: 1888320892,
    [Raid.VOW_OF_THE_DISCIPLE]: 2136320298,
    [Raid.KINGS_FALL]: 292102995,
    [Raid.ROOT_OF_NIGHTMARES]: 3699252268,
    [Raid.CROTAS_END]: 540415767
} satisfies Record<Exclude<ListedRaid, SunsetRaid>, number>
