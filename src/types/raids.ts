import { RaidHashes } from "~/data/raid-hashes"
import { Flatten } from "./generic"

// add new raids here
export const enum Raid {
    NA = -1,
    LEVIATHAN = 0,
    EATER_OF_WORLDS = 1,
    SPIRE_OF_STARS = 2,
    LAST_WISH = 3,
    SCOURGE_OF_THE_PAST = 4,
    CROWN_OF_SORROW = 5,
    GARDEN_OF_SALVATION = 6,
    DEEP_STONE_CRYPT = 7,
    VAULT_OF_GLASS = 8,
    VOW_OF_THE_DISCIPLE = 9,
    KINGS_FALL = 10,
    ROOT_OF_NIGHTMARES = 11,
    CROTAS_END = 12
}

// add new difficulties here
export const enum Difficulty {
    NA = -1,
    NORMAL = 0,
    GUIDEDGAMES = 1,
    PRESTIGE = 2,
    MASTER = 3,
    CHALLENGE_VOG = 64,
    CHALLENGE_KF = 65,
    CHALLENGE_CROTA = 66,
    CONTEST = 128
}

export type ListedRaid = (typeof ListedRaids)[number]
// sorted in reverse order
export const ListedRaids = [
    Raid.CROTAS_END,
    Raid.ROOT_OF_NIGHTMARES,
    Raid.KINGS_FALL,
    Raid.VOW_OF_THE_DISCIPLE,
    Raid.VAULT_OF_GLASS,
    Raid.DEEP_STONE_CRYPT,
    Raid.GARDEN_OF_SALVATION,
    Raid.LAST_WISH,
    Raid.CROWN_OF_SORROW,
    Raid.SCOURGE_OF_THE_PAST,
    Raid.SPIRE_OF_STARS,
    Raid.EATER_OF_WORLDS,
    Raid.LEVIATHAN
] as const

export type DifficultyForRaidType<R extends keyof typeof RaidHashes> =
    keyof (typeof RaidHashes)[R] extends Difficulty ? keyof (typeof RaidHashes)[R] : never

export type RaidHashesForRaidAndDifficulty<
    R extends ListedRaid,
    D extends DifficultyForRaidType<R>
> = (typeof RaidHashes)[R][Extract<D, keyof (typeof RaidHashes)[R]>]

export type RaidDifficultyTuple = readonly [name: ListedRaid, difficulty: Difficulty]

export const CommonRaidDifficulties = [
    Difficulty.NORMAL,
    Difficulty.GUIDEDGAMES,
    Difficulty.PRESTIGE,
    Difficulty.MASTER
] as const

export const NoContestRaids = [
    Raid.LEVIATHAN,
    Raid.EATER_OF_WORLDS,
    Raid.SPIRE_OF_STARS,
    Raid.LAST_WISH,
    Raid.SCOURGE_OF_THE_PAST
] as const

export type ContestRaid = Exclude<ListedRaid, (typeof NoContestRaids)[number]>
export type NoContestRaid = (typeof NoContestRaids)[number]

export const RaidsWithReprisedContest = [
    Raid.VAULT_OF_GLASS,
    Raid.KINGS_FALL,
    Raid.CROTAS_END
] as const
export type ReprisedRaid = (typeof RaidsWithReprisedContest)[number]

export const ReprisedContestRaidDifficulties = [
    Difficulty.CHALLENGE_VOG,
    Difficulty.CHALLENGE_KF,
    Difficulty.CHALLENGE_CROTA
] as const
export type ReprisedRaidChallengeMode = (typeof ReprisedContestRaidDifficulties)[number]

export const ElevatedRaidDifficulties = [Difficulty.MASTER, Difficulty.PRESTIGE] as const
export type ElevatedRaidDifficulty = (typeof ElevatedRaidDifficulties)[number]

export const ReprisedContestDifficultyDictionary: Record<
    (typeof RaidsWithReprisedContest)[number],
    (typeof ReprisedContestRaidDifficulties)[number]
> = {
    [Raid.VAULT_OF_GLASS]: Difficulty.CHALLENGE_VOG,
    [Raid.KINGS_FALL]: Difficulty.CHALLENGE_KF,
    [Raid.CROTAS_END]: Difficulty.CHALLENGE_CROTA
}

export type AllRaidHashesForRaid<R extends ListedRaid> = Flatten<
    (typeof RaidHashes)[R][Extract<Difficulty, keyof (typeof RaidHashes)[R]>]
>

export type ValidRaidHash = {
    [R in ListedRaid]: AllRaidHashesForRaid<R>
}[ListedRaid]
