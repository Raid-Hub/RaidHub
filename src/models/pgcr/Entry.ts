import { DestinyPostGameCarnageReportEntry, BungieMembershipType } from "bungie-net-core/models"
import PGCRStats from "./PlayerStats"
import { StatsKeys } from "../../types/types"

export default abstract class PGCREntry {
    readonly membershipId: string
    readonly membershipType: BungieMembershipType
    readonly displayName: string | undefined
    readonly stats: PGCRStats
    constructor(data: DestinyPostGameCarnageReportEntry, stats: StatsKeys | StatsKeys[]) {
        const info = data.player.destinyUserInfo
        this.membershipId = info.membershipId
        this.membershipType = info.membershipType
        this.displayName = info.bungieGlobalDisplayName || info.displayName
        this.stats = new PGCRStats(stats)
    }

    abstract get didComplete(): boolean
}
