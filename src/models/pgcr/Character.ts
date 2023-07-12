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
import { Collection } from "@discordjs/collection"

export default class DestinyPGCRCharacter implements IPGCREntry, DestinyPostGameCarnageReportEntry {
    readonly standing: number
    readonly score: DestinyHistoricalStatsValue
    readonly player: DestinyPlayer
    readonly characterId: string
    readonly values: { [key: string]: DestinyHistoricalStatsValue }
    readonly extended: DestinyPostGameCarnageReportExtendedData
    readonly weapons: PlayerWeapons
    readonly stats: IPGCREntryStats

    constructor(data: DestinyPostGameCarnageReportEntry) {
        this.standing = data.standing
        this.characterId = data.characterId
        this.score = data.score
        this.player = data.player
        this.characterId = data.characterId
        this.values = data.values
        this.extended = data.extended
        this.weapons = this.extended.weapons
            ? parseWeapons(this.extended.weapons)
            : new Collection()

        const getStat = (key: string): number | undefined => this.values[key]?.basic.value

        const weaponKills = this.weapons.reduce((kills, weapon) => kills + weapon.kills, 0)
        const _stats = {
            kills: getStat("kills")!,
            deaths: getStat("deaths")!,
            assists: getStat("assists")!,
            weaponKills,
            abilityKills: getStat("kills")! - weaponKills,
            kdr: getStat("kills")! / (getStat("deaths") || 1),
            kda: getStat("kills")! + getStat("assists")! / (getStat("deaths") || 1),
            timePlayedSeconds: !!getStat("completed")!
                ? getStat("activityDurationSeconds")! - getStat("startSeconds")!
                : getStat("timePlayedSeconds")!
        }

        this.stats = {
            ..._stats,
            score: pgcrEntryRankingScore(_stats)
        }
    }

    get displayName(): string {
        const info = this.player.destinyUserInfo
        return info.bungieGlobalDisplayName ?? info.displayName
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
