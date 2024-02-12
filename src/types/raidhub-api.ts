import type { Difficulty, Raid } from "data/raid"
import type { components, paths } from "./raidhub-openapi"

export type ListedRaid = (typeof Raid)[keyof typeof Raid]
export type MasterRaid = components["schemas"]["MasterRaidEnum"]
export type PrestigeRaid = components["schemas"]["PrestigeRaidEnum"]
export type SunsetRaid = components["schemas"]["SunsetRaidEnum"]
export type RaidDifficulty = (typeof Difficulty)[keyof typeof Difficulty]

export type RaidDifficultyTuple = readonly [name: ListedRaid, difficulty: RaidDifficulty]

export type RaidHubPath = keyof paths

export type RaidHubErrorResponseObject = components["schemas"]["RaidHubError"]

export type RaidHubAPIResponse<T> = {
    minted: string // ISO date string
    message?: string
} & ({ success: true; response: T } | RaidHubErrorResponseObject)

export type RaidHubPlayerInfo = components["schemas"]["PlayerInfo"]

export type RaidHubActivityPlayer = components["schemas"]["ActivityPlayerData"]

export type RaidHubActivityExtended = components["schemas"]["ActivityExtended"]

export type RaidHubActivityWithPlayer = components["schemas"]["ActivityWithPlayerData"]

export type RaidHubPlayerActivitiesResponse = components["schemas"]["PlayerActivitiesResponse"]
export type RaidHubPlayerActivitiesActivity =
    components["schemas"]["PlayerActivitiesResponse"]["activities"][number]

export type RaidHubActivityResponse = components["schemas"]["ActivityResponse"]

export type RaidHubPlayerResponse = components["schemas"]["PlayerProfileResponse"]
export type RaidHubPlayerBasicResponse = components["schemas"]["PlayerBasicResponse"]

export type RaidHubManifestResponse = components["schemas"]["ManifestResponse"]

export type RaidHubPlayerSearchResponse = components["schemas"]["PlayerSearchResponse"]
export type RaidHubPlayerSearchResult = RaidHubPlayerSearchResponse["results"][number]

export type RaidHubAdminQueryResponse = components["schemas"]["AdminQueryResponse"]
export type RaidHubAdminQueryBody = Required<
    paths["/admin/query"]["post"]
>["requestBody"]["content"]["application/json"]
export type RaidHubAdminQueryError = components["schemas"]["AdminQuerySyntaxError"]

export type RaidHubPlayerProfileLeaderboardEntry =
    components["schemas"]["PlayerProfileLeaderboardEntry"]

export type RaidHubRaidPath = components["schemas"]["RaidPath"]

export type RaidHubWorldFirstLeaderboardCategory =
    components["schemas"]["LeaderboardWorldfirstResponse"]["params"]["category"]

export type RaidHubIndividualLeaderboardCategory =
    components["schemas"]["LeaderboardIndividualResponse"]["params"]["category"]

export type RaidHubGlobalLeaderboardCategory =
    components["schemas"]["LeaderboardGlobalResponse"]["params"]["category"]

export type RaidHubIndividualLeaderboardEntry = components["schemas"]["IndividualLeaderboardEntry"]

export type RaidHubActivitySearchQuery = components["schemas"]["ActivitySearchBody"]
export type RaidHubLeaderboardSearchQuery = components["schemas"]["LeaderboardSearchQuery"]
