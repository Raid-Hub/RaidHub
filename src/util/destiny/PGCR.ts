import { Collection } from "@discordjs/collection"
import {
    DestinyCharacterComponent,
    DestinyHistoricalStatsActivity,
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportTeamEntry,
    UserInfoCard
} from "bungie-net-core/models"
import { Difficulty } from "~/data/raid"
import { IPGCREntryStats } from "~/types/pgcr"
import { ListedRaid, RaidDifficulty, RaidHubActivityResponse } from "~/types/raidhub-api"
import { nonParticipant } from "~/util/destiny/filterNonParticipants"
import { LocalStrings } from "~/util/presentation/localized-strings"
import { Tag, addModifiers } from "~/util/tags"
import PGCRCharacter from "./Character"
import PGCRPlayer from "./Player"

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
    mostUsedWeapon: number | null
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
    readonly difficulty: RaidDifficulty
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
                data.entries[0]?.values.activityDurationSeconds.basic.value * 1000
        )

        // todo fix
        // try {
        //     ;[this.raid, this.difficulty] = raidTupleFromHash(`${this.hash}`)
        // } catch {
        this.raid = null
        this.difficulty = Difficulty.NORMAL
        // }

        const reduce = (key: keyof IPGCREntryStats) =>
            this.players.reduce((a, b) => a + b.stats[key], 0)

        const deaths = reduce("deaths")
        const weaponsCollection = new Collection<number, number>()
        this.entries.forEach(e =>
            e.weapons.forEach(w => {
                if (weaponsCollection.has(w.hash)) {
                    weaponsCollection.set(w.hash, weaponsCollection.get(w.hash)! + w.kills)
                } else {
                    weaponsCollection.set(w.hash, w.kills)
                }
            })
        )
        this.stats = {
            mvp: this.players.size
                ? this.players.reduce<PGCRPlayer>((a, b) => (a.stats.score > b.stats.score ? a : b))
                      .displayName ?? null
                : null,
            totalKills: reduce("kills"),
            totalDeaths: reduce("deaths"),
            totalAssists: reduce("assists"),
            overallKD: deaths === 0 ? Infinity : reduce("kills") / deaths,
            overallKAD: deaths === 0 ? Infinity : (reduce("kills") + reduce("assists")) / deaths,
            totalWeaponKills: reduce("weaponKills"),
            totalSuperKills: reduce("superKills"),
            totalAbilityKills: reduce("abilityKills"),
            totalCharactersUsed: this.entries.length,
            killsPerMinute:
                (reduce("kills") /
                    ((this.completionDate.getTime() - this.startDate.getTime()) / 1000)) *
                60,
            mostUsedWeapon: weaponsCollection.sort((a, b) => b - a).firstKey() ?? null
        }
    }

    get hash(): number {
        return this.activityDetails.directorActivityHash
    }
    get completed(): boolean {
        return this.entries.some(e => e.didComplete)
    }

    get playerCount(): number {
        return this.players.size
    }

    get speed() {
        const completionDate = this.completionDate
        const startDate = this.startDate
        return completionDate.getTime() - startDate.getTime()
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

    get needsHydration(): boolean {
        return this.entries.length < 50 && this.entries.some(e => !e.membershipType)
    }

    hydrate(id: string, components: [UserInfoCard, DestinyCharacterComponent]) {
        this.entries.find(entry => entry.characterId === id)?.hydrate(components)
    }

    tags(data: RaidHubActivityResponse): { tag: Tag; placement?: number }[] {
        const tags = new Array<{ tag: Tag; placement?: number }>()
        // TODO fix
        // if (data.contest && includedIn(ReprisedContestRaidDifficulties, this.difficulty)) {
        //     const placement = data.leaderboardEntries["challenge"]
        //     tags.push({ tag: TagForReprisedContest[this.difficulty], placement })
        // }
        // if (data.dayOne) {
        //     const placement = !includedIn(ReprisedContestRaidDifficulties, this.difficulty)
        //         ? data.leaderboardEntries["normal"]
        //         : undefined
        //     tags.push({ tag: Tag.DAY_ONE, placement })
        // }
        if (data.contest) tags.push({ tag: Tag.CONTEST })
        if (data.fresh === false) tags.push({ tag: Tag.CHECKPOINT })
        if (this.difficulty === Difficulty.PRESTIGE) {
            const placement = data.leaderboardEntries["prestige"]
            tags.push({ tag: Tag.PRESTIGE, placement })
        }
        if (this.difficulty === Difficulty.MASTER) {
            const placement = data.leaderboardEntries["master"]
            tags.push({ tag: Tag.MASTER, placement })
        }
        if (this.difficulty === Difficulty.GUIDEDGAMES) tags.push({ tag: Tag.GUIDEDGAMES })
        if (data.playerCount === 1) tags.push({ tag: Tag.SOLO })
        else if (data.playerCount === 2) tags.push({ tag: Tag.DUO })
        else if (data.playerCount === 3) tags.push({ tag: Tag.TRIO })
        if (data.fresh && this.completed) {
            if (data.flawless) tags.push({ tag: Tag.FLAWLESS })
            if (this.stats.totalWeaponKills === 0) tags.push({ tag: Tag.ABILITIES_ONLY })
        }
        return tags
    }

    title(strings: LocalStrings, data: RaidHubActivityResponse): string {
        return this.raid ? addModifiers(this.raid, this.tags(data), strings) : ""
    }
}

function sortPlayers(a: PGCRPlayer, b: PGCRPlayer): number {
    if ((!a.didComplete || !b.didComplete) && a.didComplete != b.didComplete) {
        return !a.didComplete ? 1 : -1
    } else {
        return b.stats.score - a.stats.score
    }
}
