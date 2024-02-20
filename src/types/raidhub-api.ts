import type { Difficulty, Raid } from "data/raid"
import type { Prettify } from "./generic"
import type { components, paths } from "./raidhub-openapi"

type Component<T extends keyof components["schemas"]> = Prettify<components["schemas"][T]>

export type ListedRaid = (typeof Raid)[keyof typeof Raid]
export type MasterRaid = Component<"MasterRaidEnum">
export type PrestigeRaid = Component<"PrestigeRaidEnum">
export type SunsetRaid = Component<"SunsetRaidEnum">
export type RaidDifficulty = (typeof Difficulty)[keyof typeof Difficulty]

export type RaidDifficultyTuple = readonly [name: ListedRaid, difficulty: RaidDifficulty]

export type RaidHubPath = keyof paths

export type RaidHubErrorResponseObject = Component<"RaidHubError">

export type RaidHubAPIResponse<T> = {
    minted: string // ISO date string
    message?: string
} & ({ success: true; response: T } | RaidHubErrorResponseObject)

export type RaidHubPlayerInfo = Component<"PlayerInfo">

export type RaidHubActivityPlayer = Component<"ActivityPlayerData">

export type RaidHubActivityExtended = Component<"ActivityExtended">

export type RaidHubActivityWithPlayer = Component<"ActivityWithPlayerData">
export type RaidHubPlayerWithActivityData = Component<"PlayerWithActivityData">

export type RaidHubPlayerActivitiesResponse = Component<"PlayerActivitiesResponse">
export type RaidHubPlayerActivitiesActivity = Prettify<
    Component<"PlayerActivitiesResponse">["activities"][number]
>

export type RaidHubActivityResponse = Component<"ActivityResponse">

export type RaidHubPlayerResponse = Component<"PlayerProfileResponse">
export type RaidHubPlayerBasicResponse = Component<"PlayerBasicResponse">

export type RaidHubManifestResponse = Component<"ManifestResponse">

export type RaidHubPlayerSearchResponse = Component<"PlayerSearchResponse">
export type RaidHubPlayerSearchResult = RaidHubPlayerSearchResponse["results"][number]

export type RaidHubAdminQueryResponse = Component<"AdminQueryResponse">
export type RaidHubAdminQueryBody = Required<
    paths["/admin/query"]["post"]
>["requestBody"]["content"]["application/json"]
export type RaidHubAdminQueryError = Component<"AdminQuerySyntaxError">

export type RaidHubPlayerProfileLeaderboardEntry = Component<"PlayerProfileLeaderboardEntry">

export type RaidHubRaidPath = Component<"RaidPath">

export type RaidHubWorldFirstLeaderboardCategory =
    Component<"LeaderboardWorldfirstResponse">["params"]["category"]

export type RaidHubIndividualLeaderboardCategory =
    Component<"LeaderboardIndividualResponse">["params"]["category"]

export type RaidHubGlobalLeaderboardCategory =
    Component<"LeaderboardGlobalResponse">["params"]["category"]

export type RaidHubIndividualLeaderboardEntry = Component<"IndividualLeaderboardEntry">

export type RaidHubActivitySearchQuery = Component<"ActivitySearchBody">
export type RaidHubLeaderboardSearchQuery = Component<"LeaderboardSearchQuery">
