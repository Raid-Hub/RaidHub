import { BungieMembershipType } from "bungie-net-core/models"
import { Difficulty, ListedRaid } from "./raids"

export type RaidHubAPIResponse<T, E = unknown> = {
    minted: string // ISO date string
    message?: string
} & ({ success: true; response: T } | { success: false; error: E })

export type RaidHubPlayer = {
    membershipId: string
    membershipType: number | null
    iconPath: string | null
    displayName: string | null
    bungieGlobalDisplayName: string | null
    bungieGlobalDisplayNameCode: string | null
    lastSeen: Date
    clears: number
    fullClears: number
    sherpas: number
}

export type RaidHubActivity = {
    instanceId: string
    raidHash: string
    flawless: boolean | null
    completed: boolean
    fresh: boolean | null
    playerCount: number
    dateStarted: string
    dateCompleted: string
    platform: BungieMembershipType
}

export type RaidHubActivityExtended = RaidHubActivity & {
    dayOne: boolean
    weekOne: boolean
    contest: boolean
}

export type RaidHubPlayerLeaderboardEntry = {
    rank: number
    instanceId: string
    raidHash: string
    dayOne: boolean
    contest: boolean
    weekOne: boolean
}

type PlayerResponseGlobalLeaderboardPlacement =
    | {
          value: number
          rank: number
      }
    | {
          value: null
          rank: null
      }

export type RaidHubPlayerResponse = {
    player: RaidHubPlayer
    worldFirstEntries: Record<string, RaidHubPlayerLeaderboardEntry[]>
    stats: {
        global: {
            clears: PlayerResponseGlobalLeaderboardPlacement
            fullClears: PlayerResponseGlobalLeaderboardPlacement
            sherpas: PlayerResponseGlobalLeaderboardPlacement
            speedrun: PlayerResponseGlobalLeaderboardPlacement
        }
        byRaid: Record<
            ListedRaid,
            {
                clears: number
                fullClears: number
                sherpas: number
                trios: number
                duos: number
                solos: number
                fastestClear: {
                    instanceId: string
                    duration: number
                } | null
            }
        >
    }
}

export type RaidHubActivitiesResponse = {
    activities: (RaidHubActivityExtended & {
        player: RaidHubActivityPlayerData
    })[]
    nextCursor: string
}

export type RaidHubActivityResponse = RaidHubActivityExtended & {
    players: Record<
        string,
        {
            finishedRaid: boolean
            sherpas: number
            isFirstClear: boolean
        }
    >
    leaderboardEntries: Record<RaidHubManifestBoard["type"], number>
}

export type RaidHubCommonPlayerData = {
    membershipType: BungieMembershipType
    bungieGlobalDisplayName: string | null
    bungieGlobalDisplayNameCode: string | null
    displayName: string | null
    iconPath: string | null
    membershipId: string
}

export type RaidHubActivityPlayerData = {
    finishedRaid: boolean
    kills: number
    assists: number
    deaths: number
    timePlayedSeconds: number
    classHash: string
    sherpas: number
    isFirstClear: boolean
}

export type RaidHubActivityLeaderboardResponse = {
    entries: {
        rank: number
        position: number
        value: number
        activity: RaidHubActivity
        players: (RaidHubCommonPlayerData & { data: RaidHubActivityPlayerData })[]
    }[]
    date?: number
    params: {
        count: number
        page: number
    }
}

export type RaidHubIndividualLeaderboardResponse = {
    entries: {
        rank: number
        value: number
        player: {
            bungieGlobalDisplayName: string
            bungieGlobalDisplayNameCode: string
            displayName: string
            iconPath: string
            membershipId: string
            membershipType: BungieMembershipType
        }
    }[]
    params: {
        category: string
        raid: ListedRaid
        count: number
        page: number
    }
}

export type RaidHubSearchResponse<G extends boolean = any> = {
    params: {
        count: number
        term: G extends true
            ? {
                  bungieGlobalDisplayName: string
                  bungieGlobalDisplayNameCode: string
              }
            : {
                  displayName: string
              }
    }
    results: RaidHubSearchResult[]
}

export type RaidHubSearchResult = {
    membershipId: string
    membershipType: BungieMembershipType
    iconPath: string
    displayName: string
    lastSeen: string
    clears: number
} & (
    | {
          bungieGlobalDisplayName: string
          bungieGlobalDisplayNameCode: string
      }
    | {
          bungieGlobalDisplayName: null
          bungieGlobalDisplayNameCode: null
      }
)

export type RaidHubActivitySearchResponse = {
    query: Record<string, unknown>
    results: RaidHubActivityExtended[]
}
export type RaidHubActivitySearchResult = RaidHubActivity

export type RaidHubManifestBoard = {
    id: string
    date: string // ISO date string
    type: "normal" | "prestige" | "master" | "challenge"
}

export type RaidHubManifest = {
    raids: Record<ListedRaid, string>
    difficulties: Record<Difficulty, string>
    hashes: Record<
        string,
        {
            raid: ListedRaid
            difficulty: Difficulty
        }
    >
    listed: ListedRaid[]
    sunset: ListedRaid[]
    contest: ListedRaid[]
    master: ListedRaid[]
    prestige: ListedRaid[]
    reprisedChallengePairings: {
        raid: ListedRaid
        difficulty: Difficulty
    }[]
    leaderboards: {
        worldFirst: Record<ListedRaid, RaidHubManifestBoard[]>
        individual: Record<ListedRaid, { category: string; name: string }[]>
    }
}

export type RaidHubLeaderboardSearchResult = {
    page: number
    position: number
    entries:
        | RaidHubIndividualLeaderboardResponse["entries"]
        | RaidHubActivityLeaderboardResponse["entries"]
}
