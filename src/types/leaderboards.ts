export type LeaderboardResponse = {
    date: Date | null
    entries: LeaderboardEntry[]
}

export type LeaderboardEntry = {
    id: string
    rank: number
    url: string
    participants: LeaderboardEntryParticipant[]
    timeInSeconds: number
}

export type LeaderboardEntryParticipant = {
    id: string
    iconURL: string | null
    displayName: string
    url: string | null
}

export type IndividualLeaderboardEntry = {
    rank: number
    iconURL: string | null
    displayName: string
    id: string
    url: string
    value: number
}
