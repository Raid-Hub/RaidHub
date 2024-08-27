export type CheckpointResponse = {
    official:
        | {
              name: string
              activity: string
              activityHash: number
              encounter: string
              players: number
              maxPlayers: number
              difficultyTier: CheckpointDifficultyTier
              imgURL: string
              iconURL: string
              discordEmoji: string
              displayOrder: number
          }[]
        | null
    community: null
    /** DateTime */
    lastUpdated: number
    alert: {
        alertActive: boolean
        alertText: string
    }
}

enum CheckpointDifficultyTier {
    Unknown = 1,
    Standard = 2,
    Master = 3
}
