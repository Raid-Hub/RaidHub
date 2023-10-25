import { BungieMembershipType } from "bungie-net-core/models"

export type RaidHubAPIResponse<T, E = unknown> = {
    minted: number
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
    sherpas: number
    lowmanSherpas: number
}

export type RaidHubActivity = {
    activityId: string
    raidHash: string
    flawless: boolean | null
    completed: boolean
    fresh: boolean | null
    playerCount: number
    dateStarted: string
    dateCompleted: string
    dayOne: boolean
    contest: boolean
}

export type RaidHubPlayerResponse = {
    player: RaidHubPlayer
    activityLeaderboardEntries: Record<
        string,
        {
            rank: number
            activityId: string
            dayOne: boolean
            contest: boolean
            weekOne: boolean
        }
    >
}

export type RaidHubActivitiesResponse = {
    activities: (RaidHubActivity & {
        didMemberComplete: boolean
    })[]
    prevActivity: string
}

export type RaidHubActivityResponse = RaidHubActivity & { players: Record<string, boolean> }

export type RaidHubActivityLeaderboardResponse = {
    entries: {
        rank: number
        activityId: string
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
    results: RaidHubSearchResult<G>[]
}

export type RaidHubSearchResult<G extends boolean = any> = {
    membershipId: string
    membershipType: BungieMembershipType
    iconPath: string
    displayName: string
    lastSeen: string
    clears: number
} & (G extends true
    ? {
          bungieGlobalDisplayName: string
          bungieGlobalDisplayNameCode: string
      }
    : {
          bungieGlobalDisplayName: null
          bungieGlobalDisplayNameCode: null
      })
