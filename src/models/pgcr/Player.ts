import PGCRCharacter from "./Character"
import { mergeWeaponCollections } from "../../util/destiny/weapons"
import { IPGCREntry, IPGCREntryStats, PlayerWeapons } from "../../types/pgcr"
import { pgcrEntryRankingScore } from "../../util/destiny/pgcrEntryRankingScore"
import { BungieMembershipType } from "bungie-net-core/lib/models"

export default class PGCRPlayer implements IPGCREntry {
    readonly characters: PGCRCharacter[]
    readonly deathless: boolean
    readonly stats: IPGCREntryStats
    readonly weapons: PlayerWeapons
    constructor(characters: PGCRCharacter[]) {
        this.characters = characters.sort((a, b) => {
            if (a.didComplete != b.didComplete) {
                return a.didComplete ? -1 : 1
            } else {
                return b.values.startSeconds.basic.value - a.values.startSeconds.basic.value
            }
        })
        this.deathless = characters.every(character => character.stats.deaths === 0)

        const reduce = (key: keyof IPGCREntryStats) =>
            this.characters.reduce((base, c) => base + c.stats[key], 0)
        const _stats = {
            kills: reduce("kills"),
            deaths: reduce("deaths"),
            assists: reduce("assists"),
            weaponKills: reduce("weaponKills"),
            abilityKills: reduce("abilityKills"),
            timePlayedSeconds: reduce("timePlayedSeconds")
        }

        this.stats = {
            ..._stats,
            kdr: _stats.kills / (_stats.deaths || 1),
            kda: (_stats.kills + _stats.assists) / (_stats.deaths || 1),
            score: pgcrEntryRankingScore(_stats)
        }

        this.weapons = mergeWeaponCollections(this.characters.map(char => char.weapons))
    }
    get membershipId(): string {
        return this.characters[0].membershipId
    }

    get membershipType(): BungieMembershipType {
        return this.characters[0].membershipType
    }

    get displayName(): string | undefined {
        return this.characters.find(c => c.displayName)?.displayName
    }

    get flawless(): boolean {
        return this.deathless && this.didComplete
    }

    get characterIds() {
        return this.characters.map(({ characterId }) => characterId)
    }

    get didComplete(): boolean {
        return this.characters.some(({ didComplete }) => didComplete)
    }

    get banner(): number {
        return this.characters[0].banner
    }
}
