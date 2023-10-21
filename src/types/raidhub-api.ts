export type RaidHubAPIResponse<T> = {
    minted: number
    message?: string
} & ({ success: true; response: T } | { success: false; error: string })

export type RaidHubActivity = {
    activityId: string
    raidHash: string
    flawless: boolean | null
    completed: boolean
    fresh: boolean | null
    playerCount: number
    dateStarted: string
    dateCompleted: string
    didMemberComplete: boolean
}

export type RaidHubActivitiesResponse = {
    activities: RaidHubActivity[]
    prevActivity: string
}
