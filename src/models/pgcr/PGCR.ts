import {
    DestinyCharacterComponent,
    DestinyHistoricalStatsActivity,
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportTeamEntry,
    UserInfoCard
} from "bungie-net-core/models"
import PGCRCharacter from "./Character"
import PGCRPlayer from "./Player"
import { Seasons } from "../../data/destiny-dates"
import {
    ListedRaid,
    ListedRaids,
    Difficulty,
    ReprisedContestRaidDifficulties
} from "../../types/raids"
import { Tag, TagForReprisedContest, addModifiers } from "../../util/raidhub/tags"
import { LocalStrings } from "../../util/presentation/localized-strings"
import { IPGCREntryStats, WeaponStatsValues } from "../../types/pgcr"
import { secondsToHMS } from "../../util/presentation/formatting"
import { isContest, isDayOne, raidTupleFromHash } from "../../util/destiny/raidUtils"
import { Collection } from "@discordjs/collection"
import { nonParticipant } from "../../util/destiny/filterNonParticipants"
import { includedIn } from "~/util/betterIncludes"

type PostGameCarnageReportOptions = {
    filtered: boolean
}
type SummaryStats = {
    mvp: string | null
    totalKills: number
    totalDeaths: number
    totalAssists: number
    overallKD: number
    overallKAD: number
    totalWeaponKills: number
    totalSuperKills: number
    totalAbilityKills: number
    killsPerMinute: number
    totalCharactersUsed: number
    mostUsedWeapon: WeaponStatsValues | null
}

export default class DestinyPGCR implements DestinyPostGameCarnageReportData {
    readonly activityDetails: DestinyHistoricalStatsActivity
    readonly activityWasStartedFromBeginning: boolean | undefined
    readonly entries: PGCRCharacter[]
    readonly period: string
    readonly startingPhaseIndex: number | undefined
    readonly teams: DestinyPostGameCarnageReportTeamEntry[]

    readonly players: Collection<string, PGCRPlayer>
    readonly startDate: Date
    readonly completionDate: Date
    readonly raid: ListedRaid | null
    readonly difficulty: Difficulty
    readonly stats: SummaryStats

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
        this.players = new Collection<string, PGCRPlayer>()
        const buckets = new Map<string, Collection<string, PGCRCharacter>>()
        this.entries.forEach(char => {
            if (buckets.has(char.membershipId)) {
                buckets.get(char.membershipId)!.set(char.characterId, char)
            } else {
                buckets.set(char.membershipId, new Collection([[char.characterId, char]]))
            }
        })
        buckets.forEach((characters, membershipId) => {
            this.players.set(membershipId, new PGCRPlayer(membershipId, characters))
        })
        this.players.sort(sortPlayers)

        this.startDate = new Date(this.period)
        this.completionDate = new Date(
            this.startDate.getTime() +
                this.entries[0]?.values.activityDurationSeconds.basic.value * 1000
        )

        try {
            ;[this.raid, this.difficulty] = raidTupleFromHash(`${this.hash}`)
        } catch {
            this.raid = null
            this.difficulty = Difficulty.NORMAL
        }

        const reduce = (key: keyof IPGCREntryStats) =>
            this.players.reduce((a, b) => a + b.stats[key], 0)
        this.stats = {
            mvp:
                this.players.reduce<PGCRPlayer>((a, b) => (a.stats.score > b.stats.score ? a : b))
                    .displayName ?? null,
            totalKills: reduce("kills"),
            totalDeaths: reduce("deaths"),
            totalAssists: reduce("assists"),
            overallKD: reduce("kills") / reduce("deaths"),
            overallKAD: (reduce("deaths") + reduce("assists")) / reduce("deaths"),
            totalWeaponKills: reduce("weaponKills"),
            totalSuperKills: reduce("superKills"),
            totalAbilityKills: reduce("abilityKills"),
            totalCharactersUsed: this.entries.length,
            killsPerMinute:
                (reduce("kills") /
                    ((this.completionDate.getTime() - this.startDate.getTime()) / 1000)) *
                60,
            mostUsedWeapon:
                this.entries
                    .map(e => e.weapons)
                    .reduce((a, b) =>
                        (a?.first()?.kills ?? 0) >= (b?.first()?.kills ?? 0) ? a : b
                    )
                    .first() ?? null
        }
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
        return this.players.size
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
        if (!this.raid) return tags
        if (!ListedRaids.includes(this.raid)) return []
        if (isDayOne(this.raid, this.completionDate)) tags.push(Tag.DAY_ONE)
        if (isContest(this.raid, this.startDate)) {
            if (includedIn(ReprisedContestRaidDifficulties, this.difficulty)) {
                tags.push(TagForReprisedContest[this.difficulty])
            }
            tags.push(Tag.CONTEST)
        }
        if (this.wasFresh() === false) tags.push(Tag.CHECKPOINT)
        if (this.difficulty === Difficulty.PRESTIGE) tags.push(Tag.PRESTIGE)
        if (this.difficulty === Difficulty.MASTER) tags.push(Tag.MASTER)
        if (this.difficulty === Difficulty.GUIDEDGAMES) tags.push(Tag.GUIDEDGAMES)
        if (this.playerCount === 1) tags.push(Tag.SOLO)
        else if (this.playerCount === 2) tags.push(Tag.DUO)
        else if (this.playerCount === 3) tags.push(Tag.TRIO)
        if (this.wasFresh() && this.completed) {
            if (this.flawless) tags.push(Tag.FLAWLESS)
            if (this.stats.totalWeaponKills === 0) tags.push(Tag.ABILITIES_ONLY)
        }
        return tags
    }

    get weightedScores(): Collection<string, number> {
        const totalScore = this.players.reduce(
            (runningTotal, current) => runningTotal + current.stats.score,
            0
        )
        const avgScore = totalScore / this.playerCount
        return new Collection(
            this.players.map(p => {
                const percentage = ((p.stats.score - avgScore) / avgScore) * 100
                return [p.membershipId, 100 + percentage]
            })
        )
    }

    title(strings: LocalStrings): string {
        return this.raid ? addModifiers(this.raid, this.tags, strings) : ""
    }

    get needsHydration(): boolean {
        return this.entries.length < 50 && this.entries.some(e => !e.membershipType)
    }

    hydrate(id: string, components: [UserInfoCard, DestinyCharacterComponent]) {
        this.entries.find(entry => entry.characterId === id)?.hydrate(components)
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

function sortPlayers(a: PGCRPlayer, b: PGCRPlayer): number {
    if ((!a.didComplete || !b.didComplete) && a.didComplete != b.didComplete) {
        return !a.didComplete ? 1 : -1
    } else {
        return b.stats.score - a.stats.score
    }
}
