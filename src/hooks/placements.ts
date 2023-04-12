import { useEffect, useState } from "react"
import { fetchActivityPlacements } from "../util/http/raid-hub"
import { ActivityPlacements } from "../util/types"

type UsePlacements = {
    placements: ActivityPlacements | null
    error: string | null
    isLoading: boolean
}

export function usePlacements(activityId: string): UsePlacements {
    const [placements, setPlacements] = useState<ActivityPlacements | null>(
        null,
    )
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        fetchActivityPlacements(activityId)
            .then(placements => setPlacements(placements))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [])
    return { placements, error, isLoading }
}
