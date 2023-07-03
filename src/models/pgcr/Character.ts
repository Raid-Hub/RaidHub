import {
    BungieMembershipType,
    DestinyCharacterComponent,
    DestinyClass,
    DestinyHistoricalStatsValue,
    DestinyPlayer,
    DestinyPostGameCarnageReportEntry,
    DestinyPostGameCarnageReportExtendedData,
    DestinyProfileComponent
} from "bungie-net-core/lib/models"
import { CharacterLogos, CharacterName, CharacterType } from "../../util/destiny/characters"
import { parseWeapons } from "../../util/destiny/weapons"
import { IPGCREntry, IPGCREntryStats, PlayerWeapons } from "../../types/pgcr"
import { pgcrEntryRankingScore } from "../../util/destiny/pgcrEntryRankingScore"

export default class DestinyPGCRCharacter implements IPGCREntry, DestinyPostGameCarnageReportEntry {
    readonly standing: number
    readonly score: DestinyHistoricalStatsValue
    readonly player: DestinyPlayer
    readonly characterId: string
    readonly values: { [key: string]: DestinyHistoricalStatsValue }
    readonly extended: DestinyPostGameCarnageReportExtendedData
    readonly weapons: PlayerWeapons

    constructor(data: DestinyPostGameCarnageReportEntry) {
        this.standing = data.standing
        this.characterId = data.characterId
        this.score = data.score
        this.player = data.player
        this.characterId = data.characterId
        this.values = data.values
        this.extended = data.extended
        this.weapons = parseWeapons(this.extended.weapons)
    }

    get displayName(): string {
        const info = this.player.bungieNetUserInfo
        return info.bungieGlobalDisplayName
            ? info.bungieGlobalDisplayName + "#" + info.bungieGlobalDisplayNameCode
            : info.displayName
    }

    get membershipId(): string {
        return this.player.destinyUserInfo.membershipId
    }

    get membershipType(): BungieMembershipType {
        return this.player.destinyUserInfo.membershipType
    }

    get didComplete(): boolean {
        return !!this.values.completed.basic.value
    }

    get className(): string {
        return this.player.characterClass ?? CharacterName[DestinyClass.Unknown]
    }

    get logo() {
        return CharacterLogos[CharacterType[this.className ?? ""]]
    }

    get stats(): IPGCREntryStats {
        const getStat = (key: string): number | undefined => {
            return this.values[key]?.basic.value
        }
        const _stats = {
            kills: getStat("kills")!,
            deaths: getStat("deaths")!,
            assists: getStat("assists")!,
            weaponKills: getStat("weaponKills")!,
            abilityKills: getStat("abilityKills")!,
            kdr: getStat("kills")! / (getStat("deaths") || 1),
            kda: getStat("kills")! + getStat("assists")! / (getStat("deaths") || 1),
            timePlayedSeconds: getStat("timePlayedSeconds")!
        }

        return {
            ..._stats,
            score: pgcrEntryRankingScore(_stats)
        }
    }

    hydrate([profile, character]: [
        profile: DestinyProfileComponent,
        character: DestinyCharacterComponent
    ]) {
        Object.assign(this.player, {
            ...this.player,
            ...character,
            characterClass: CharacterName[character.classType],
            destinyUserInfo: {
                ...this.player.bungieNetUserInfo,
                ...profile.userInfo
            }
        })
    }
}
