import { type CheckpointResponse } from "./types"

const checkpointsURL = "https://d2cp.io/platform/checkpoints"

export const getCheckpoints = async () => {
    const response = await fetch(checkpointsURL).then(res => {
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
                activityName: checkpoint.activity,
                activityHash: String(checkpoint.activityHash),
                difficultyTier: checkpoint.difficultyTier < 3 ? "Normal" : "Master",
                openCapacity: checkpoint.maxPlayers - checkpoint.players,
                currentPlayers: checkpoint.players,
                maxPlayers: checkpoint.maxPlayers,
                encounterName: checkpoint.encounter,
                encounterImageURL: checkpoint.imgURL
            })) ?? []
    }
}
