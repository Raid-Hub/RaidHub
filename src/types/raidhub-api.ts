import { components } from "./raidhub-openapi"

export type RaidHubAPIResponse<T> = {
    minted: string // ISO date string
    message?: string
} & ({ success: true; response: T } | components["schemas"]["RaidHubError"])

export type RaidHubPlayerInfo = components["schemas"]["PlayerInfo"]

export type RaidHubActivitiesResponse = components["schemas"]["PlayerActivitiesResponse"]
