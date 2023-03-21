import { useEffect, useState } from "react"
import { ActivityPlacements, fetchActivityPlacements } from "../util/server-connection"

interface UsePlacements {
    placements: ActivityPlacements | null
    error: string | null
}

export function usePlacements(activityId: string): UsePlacements {
    const [placements, setPlacements] = useState<ActivityPlacements | null>(null)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        fetchActivityPlacements(activityId)
            .then(placements => setPlacements(placements))
            .catch(err => setError(err))
    }, [])
    return { placements, error }
}