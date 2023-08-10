export type LeaderboardEntry = {
    id: string
    rank: number
    url: string
    participants: LeaderboardEntryParticipant[]
    timeInSeconds: number
    videoURL?: string
}

export type LeaderboardEntryParticipant = {
    id: string
    iconURL: string | null
    displayName: string
    url: string | null
}
