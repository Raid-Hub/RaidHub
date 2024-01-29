import { components, paths } from "./raidhub-openapi"

export type RaidHubPath = keyof paths

export type RaidHubErrorResponseObject = components["schemas"]["RaidHubError"]

export type RaidHubAPIResponse<T> = {
    minted: string // ISO date string
    message?: string
} & ({ success: true; response: T } | RaidHubErrorResponseObject)

export type RaidHubPlayerInfo = components["schemas"]["PlayerInfo"]

export type RaidHubActivityExtended = components["schemas"]["ActivityExtended"]

export type RaidHubActivitiesResponse = components["schemas"]["PlayerActivitiesResponse"]

export type RaidHubManifestResponse = components["schemas"]["ManifestResponse"]

export type RaidHubPlayerSearchResponse = components["schemas"]["PlayerSearchResponse"]

export type RaidHubRaidPath = components["schemas"]["RaidPath"]

export type RaidHubWorldFirstLeaderboardCategory =
    components["schemas"]["LeaderboardWorldfirstResponse"]["params"]["category"]

export type RaidHubIndividualLeaderboardCategory =
    components["schemas"]["LeaderboardIndividualResponse"]["params"]["category"]

export type RaidHubGlobalLeaderboardCategory =
    components["schemas"]["LeaderboardGlobalResponse"]["params"]["category"]

export type RaidHubActivitySearchQuery = components["schemas"]["ActivitySearchQuery"]
export type RaidHubLeaderboardSearchQuery = components["schemas"]["LeaderboardSearchQuery"]
