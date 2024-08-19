import type { KeysWhichValuesExtend, Prettify } from "../../types/generic"
import type { components, paths } from "./openapi"

type Component<T extends keyof components["schemas"]> = Prettify<components["schemas"][T]>

// Generic API
export type RaidHubGetPath = KeysWhichValuesExtend<paths, GetSchema>
export type RaidHubPostPath = KeysWhichValuesExtend<paths, PostSchema>

export type RaidHubErrorSchema<E extends RaidHubErrorCode = RaidHubErrorCode> = Component<E>

export type RaidHubAPIResponse<T = unknown, C extends RaidHubErrorCode = RaidHubErrorCode> =
    | RaidHubAPISuccessResponse<T>
    | RaidHubAPIErrorResponse<C>
export type RaidHubAPISuccessResponse<T> = { minted: string; success: true; response: T }
export type RaidHubAPIErrorResponse<E extends RaidHubErrorCode = RaidHubErrorCode> = {
    minted: string
    success: false
    code: E
    error: RaidHubErrorSchema<E>
}

// Components
export type RaidHubErrorCode = Component<"ErrorCode">
export type RaidHubLeaderboardPagination = Component<"LeaderboardPagination">

export type RaidHubDestinyMembershipType = Component<"DestinyMembershipType">

export type RaidHubActivityDefinition = Component<"ActivityDefinition">
export type RaidHubVersionDefinition = Component<"VersionDefinition">

export type RaidHubPlayerInfo = Component<"PlayerInfo">
export type RaidHubInstance = Component<"Instance">
export type RaidHubInstanceExtended = Component<"InstanceExtended">
export type RaidHubInstancePlayerExtended = Component<"InstancePlayerExtended">
export type RaidHubInstanceCharacter = Component<"InstanceCharacter">
export type RaidHubInstanceForPlayer = Component<"InstanceForPlayer">
export type RaidHubWorldFirstEntry = Component<"WorldFirstEntry">

export type RaidHubLeaderboardData = Component<"LeaderboardData">
export type RaidHubIndividualLeaderboardEntry = Component<"IndividualLeaderboardEntry">

export type RaidHubLeaderboardURL = RaidHubGetPath &
    (
        | "/leaderboard/individual/global/{category}"
        | "/leaderboard/individual/pantheon/{version}/{category}"
        | "/leaderboard/individual/raid/{raid}/{category}"
        | "/leaderboard/team/contest/{raid}"
        | "/leaderboard/team/first/{activity}/{version}"
    )

export type PathParamsForLeaderboardURL<T extends RaidHubLeaderboardURL> =
    paths[T]["get"]["parameters"]["path"]
export type ResponseForLeaderboardURL<T extends RaidHubLeaderboardURL> =
    paths[T]["get"]["responses"][200]["content"]["application/json"]

export type RaidHubAdminQueryBody = Required<
    paths["/admin/query"]["post"]
>["requestBody"]["content"]["application/json"]

// Responses
export type RaidHubManifestResponse = Component<"ManifestResponse">
export type RaidHubPlayerActivitiesResponse = Component<"PlayerActivitiesResponse">
export type RaidHubPlayerProfileResponse = Component<"PlayerProfileResponse">
export type RaidHubPlayerSearchResponse = Component<"PlayerSearchResponse">
export type RaidHubAdminQueryResponse = Component<"AdminQueryResponse">

interface GetSchema {
    get: {
        parameters?: {
            query?: unknown
            path?: unknown
        }
        responses: {
            200: {
                content: {
                    readonly "application/json": unknown
                }
            }
        }
    }
}

interface PostSchema {
    post: {
        requestBody?: {
            content: {
                "application/json": unknown
            }
        }
        parameters?: {
            query?: unknown
            path?: unknown
        }
        responses: {
            200: {
                content: {
                    readonly "application/json": unknown
                }
            }
        }
    }
}
