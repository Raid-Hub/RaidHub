import { type CheckpointResponse } from "./types"

export type Checkpoint = {
    encounterImageURL: string
    maxPlayers: number
    currentPlayers: number
    encounterName: string
    difficultyTier: string
    botBungieName: string
    activityHash: string
    activityName: string
}

const checkpointsURL = "https://d2cp.io/platform/checkpoints"

export const getCheckpoints = async () => {
    try {
        const response = await fetch(checkpointsURL, {
            next: { revalidate: 30 }
        }).then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch checkpoints")
            } else {
                return res.json() as Promise<CheckpointResponse>
            }
        })

        return {
            alert: {
                active: response.alert.alertActive,
                message: response.alert.alertText
            },
            updatedAt: new Date(response.lastUpdated * 1000),
            checkpoints:
                response.official?.map(checkpoint => ({
                    key: checkpoint.displayOrder,
                    botBungieName: checkpoint.name,
                    activityHash: String(checkpoint.activityHash),
                    openCapacity: checkpoint.maxPlayers - checkpoint.players,
                    currentPlayers: checkpoint.players,
                    maxPlayers: checkpoint.maxPlayers,
                    encounterName: checkpoint.encounter,
                    encounterImageURL: checkpoint.imgURL
                })) ?? []
        }
    } catch (err) {
        console.error(err)
        return {
            alert: {
                active: false,
                message: "Failed to fetch checkpoints"
            },
            updatedAt: new Date(),
            checkpoints: []
        }
    }
}
