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
    dayOne: boolean
    weekOne: boolean
    contest: boolean
    platform: BungieMembershipType
}

export type RaidHubPlayerLeaderboardEntry = {
    rank: number
    instanceId: string
    raidHash: string
    dayOne: boolean
    contest: boolean
    weekOne: boolean
}

export type RaidHubPlayerResponse = {
    player: RaidHubPlayer
    activityLeaderboardEntries: Record<string, RaidHubPlayerLeaderboardEntry[]>
}

export type RaidHubActivitiesResponse = {
    activities: (RaidHubActivity & {
        didMemberComplete: boolean
    })[]
    nextCursor: string
}

export type RaidHubActivityResponse = RaidHubActivity & {
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

export type RaidHubActivityLeaderboardResponse = {
    entries: {
        rank: number
        instanceId: string
        dateCompleted: string
        dateStarted: string
        players: {
            bungieGlobalDisplayName: string
            bungieGlobalDisplayNameCode: string
            displayName: string
            iconPath: string
            membershipId: string
            membershipType: BungieMembershipType
            didPlayerFinish: boolean
        }[]
        dayOne: boolean
        contest: boolean
        weekOne: boolean
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
    results: RaidHubActivitySearchResult[]
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
        individual: Record<
            ListedRaid,
            {
                clears: boolean
                fresh: boolean
                sherpas: boolean
                trios: boolean
                duos: boolean
                solos: boolean
            }
        >
    }
}
