import { useEffect, useState } from "react"
import { fetchActivityPlacements } from "../util/http/raid-hub"
import { ActivityPlacements, ErrorHandler } from "../util/types"
type UsePlacementsParams = {
    activityId: string
    errorHandler: ErrorHandler
}
type UsePlacements = {
    placements: ActivityPlacements | null
    isLoading: boolean
}

export function usePlacements({ activityId, errorHandler }: UsePlacementsParams): UsePlacements {
    const [placements, setPlacements] = useState<ActivityPlacements | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        fetchActivityPlacements(activityId)
            .then(placements => setPlacements(placements))
            .catch(errorHandler)
            .finally(() => setLoading(false))
    }, [activityId])
    return { placements, isLoading }
}
