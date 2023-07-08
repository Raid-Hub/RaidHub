import {
    DestinyCharacterComponent,
    DestinyHistoricalStatsActivity,
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportEntry,
    DestinyPostGameCarnageReportTeamEntry,
    DestinyProfileComponent
} from "bungie-net-core/lib/models"
import PGCRCharacter from "./Character"
import DestinyPGCRCharacter from "./Character"
import PGCRPlayer from "./Player"
import { Seasons } from "../../util/destiny/dates"
import { Difficulty, Raid, isContest, isDayOne, raidTupleFromHash } from "../../util/destiny/raid"
import { Tag, addModifiers } from "../../util/raidhub/tags"
import { LocalStrings } from "../../util/presentation/localized-strings"
import { IPGCREntryStats } from "../../types/pgcr"
import { secondsToHMS } from "../../util/presentation/formatting"

type PostGameCarnageReportOptions = {
    filtered: boolean
}
export default class DestinyPGCR implements DestinyPostGameCarnageReportData {
    readonly activityDetails: DestinyHistoricalStatsActivity
    readonly activityWasStartedFromBeginning: boolean | undefined
    readonly entries: DestinyPGCRCharacter[]
    readonly period: string
    readonly startingPhaseIndex: number | undefined
    readonly teams: DestinyPostGameCarnageReportTeamEntry[]

    readonly players: PGCRPlayer[]
    readonly startDate: Date
    readonly completionDate: Date
    readonly raid: Raid
    readonly difficulty: Difficulty

    constructor(data: DestinyPostGameCarnageReportData, options: PostGameCarnageReportOptions) {
        this.period = data.period
        this.startingPhaseIndex = data.startingPhaseIndex
        this.activityWasStartedFromBeginning = data.activityWasStartedFromBeginning
        this.activityDetails = data.activityDetails
        this.entries = (
            options.filtered ? data.entries.filter(entry => !nonParticipant(entry)) : data.entries
        ).map(e => new PGCRCharacter(e))
        this.teams = data.teams

        // group characters by membershipId
        const players = new Array<PGCRPlayer>()
        const buckets = new Map<string, DestinyPGCRCharacter[]>()
        this.entries.forEach(char => {
            if (buckets.has(char.membershipId)) {
                buckets.get(char.membershipId)!.push(char)
            } else {
                buckets.set(char.membershipId, [char])
            }
        })
        buckets.forEach(characters => {
            players.push(new PGCRPlayer(characters))
        })
        this.players = players.sort(sortPlayers)

        this.startDate = new Date(this.period)
        this.completionDate = new Date(
            this.startDate.getTime() +
                this.entries[0].values.activityDurationSeconds.basic.value * 1000
        )
        ;[this.raid, this.difficulty] = raidTupleFromHash(`${this.hash}`)
    }

    get hash(): number {
        return this.activityDetails.directorActivityHash
    }
    get completed(): boolean {
        return this.entries.some(e => e.didComplete)
    }

    get flawless(): boolean {
        return this.completed && this.players.every(p => p.deathless)
    }

    get playerCount(): number {
        return this.players.length
    }

    get stats() {
        const reduce = (key: keyof IPGCREntryStats) =>
            this.players.reduce((a, b) => a + b.stats[key], 0)
        return {
            mvp: this.players.reduce((a, b) => (a.stats.score > b.stats.score ? a : b)).displayName,
            totalKills: reduce("kills"),
            totalDeaths: reduce("deaths"),
            totalAssists: reduce("assists"),
            totalWeaponKills: reduce("weaponKills"),
            totalAbilityKills: reduce("abilityKills"),
            killsPerMinute:
                (reduce("kills") /
                    ((this.completionDate.getTime() - this.startDate.getTime()) / 1000)) *
                60,
            totalCharactersUsed: this.entries.length,
            mostUsedWeapon: this.entries
                .map(e => e.weapons)
                .reduce((a, b) => ((a?.first()?.kills ?? 0) >= (b?.first()?.kills ?? 0) ? a : b))
                .first()
        }
    }

    get speed() {
        const completionDate = this.completionDate
        const startDate = this.startDate
        return {
            value: completionDate.getTime() - startDate.getTime(),
            string(strings: LocalStrings) {
                return secondsToHMS(this.value / 1000)
            }
        }
    }

    get tags(): Tag[] {
        const tags = new Array<Tag>()
        if (this.raid == Raid.NA) return []
        if (isDayOne(this.raid, this.completionDate)) tags.push(Tag.DAY_ONE)
        if (isContest(this.raid, this.startDate)) {
            switch (this.difficulty) {
                case Difficulty.CHALLENGEKF:
                    tags.push(Tag.CHALLENGE_KF)
                    break
                case Difficulty.CHALLENGEVOG:
                    tags.push(Tag.CHALLENGE_VOG)
                    break
                default:
                    tags.push(Tag.CONTEST)
            }
        }
        if (this.wasFresh() === false) tags.push(Tag.CHECKPOINT)
        if (this.difficulty === Difficulty.PRESTIGE) tags.push(Tag.PRESTIGE)
        if (this.difficulty === Difficulty.MASTER) tags.push(Tag.MASTER)
        if (this.playerCount === 1) tags.push(Tag.SOLO)
        else if (this.playerCount === 2) tags.push(Tag.DUO)
        else if (this.playerCount === 3) tags.push(Tag.TRIO)
        if (this.wasFresh() && this.completed) {
            if (this.flawless) tags.push(Tag.FLAWLESS)
            if (this.stats.totalWeaponKills === 0) tags.push(Tag.ABILITIES_ONLY)
        }
        return tags
    }

    title(strings: LocalStrings): string {
        return addModifiers(this.raid, this.tags, strings)
    }

    hydrate(data: Map<string, [DestinyProfileComponent, DestinyCharacterComponent]>) {
        data.forEach((components, characterId) => {
            this.entries.find(entry => entry.characterId === characterId)?.hydrate(components)
        })
    }

    /**
     * Given a report, determines if it was completed from the start
     * @returns null if it cannot be determined
     */
    wasFresh(): boolean | null {
        if (this.completionDate.getTime() < Seasons.Hunt.start.getTime()) {
            /* pre-BL -- startingPhaseIndex working as intended */
            return this.startingPhaseIndex === 0
        } else if (this.completionDate.getTime() < Seasons.Risen.start.getTime()) {
            /* beyond light -- startingPhaseIndex reporting 0 always */
            return null
        } else if (this.completionDate.getTime() < Seasons.Haunted.start.getTime()) {
            /* season of the risen -- activityWasStartedFromBeginning added but not populating properly
       because a wipe made it not fresh */
            return this.activityWasStartedFromBeginning || null
        } else {
            /* modern era -- working as intended with activityWasStartedFromBeginning */
            return !!this.activityWasStartedFromBeginning
        }
    }
}

/**
 * Determines if an entry was a non-participant in the raid
 * @param entry The entry to determine to ensure
 * @returns
 */
function nonParticipant(entry: DestinyPostGameCarnageReportEntry): boolean {
    return (
        entry.values.timePlayedSeconds?.basic.value <= 25 &&
        entry.values.kills?.basic.value === 0 &&
        entry.values.deaths?.basic.value === 0
    )
}

function sortPlayers(a: PGCRPlayer, b: PGCRPlayer): number {
    if ((!a.didComplete || !b.didComplete) && a.didComplete != b.didComplete) {
        return !a.didComplete ? 1 : -1
    } else {
        return b.stats.score - a.stats.score
    }
}
