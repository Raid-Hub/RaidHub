import { Flatten } from "./generic"
import { components } from "./raidhub-openapi"

export type ListedRaid = components["schemas"]["RaidEnum"]
export type Difficulty = components["schemas"]["RaidVersionEnum"]

export type RaidDifficultyTuple = readonly [name: ListedRaid, difficulty: Difficulty]

// export type ContestRaid = Exclude<ListedRaid, (typeof NoContestRaids)[number]>
// export type NoContestRaid = (typeof NoContestRaids)[number]

// export type ReprisedRaid = components["schemas"][""]

// export type ReprisedRaidChallengeMode = (typeof ReprisedContestRaidDifficulties)[number]

// export type ElevatedRaidDifficulty = (typeof ElevatedRaidDifficulties)[number]

// export type MasterRaid = (typeof MasterRaids)[number]

// export const PrestigeRaids = [Raid.LEVIATHAN, Raid.SPIRE_OF_STARS, Raid.EATER_OF_WORLDS] as const
// export type PrestigeRaid = (typeof PrestigeRaids)[number]

// export const ReprisedContestDifficultyDictionary: Record<
//     (typeof RaidsWithReprisedContest)[number],
//     (typeof ReprisedContestRaidDifficulties)[number]
// > = {
//     [Raid.VAULT_OF_GLASS]: Difficulty.CHALLENGE_VOG,
//     [Raid.KINGS_FALL]: Difficulty.CHALLENGE_KF,
//     [Raid.CROTAS_END]: Difficulty.CHALLENGE_CROTA
// }

// export type AllRaidHashesForRaid<R extends ListedRaid> = Flatten<
//     (typeof RaidHashes)[R][Extract<Difficulty, keyof (typeof RaidHashes)[R]>]
// >

// export type ValidRaidHash = {
//     [R in ListedRaid]: AllRaidHashesForRaid<R>
// }[ListedRaid]

// export const SunsetRaids = [
//     Raid.LEVIATHAN,
//     Raid.EATER_OF_WORLDS,
//     Raid.SPIRE_OF_STARS,
//     Raid.SCOURGE_OF_THE_PAST,
//     Raid.CROWN_OF_SORROW
// ] as const
// export type SunsetRaid = (typeof SunsetRaids)[number]
