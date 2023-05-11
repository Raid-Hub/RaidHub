import { useEffect, useState } from "react"
import { fetchActivityPlacements } from "../util/http/raid-hub"
import { ActivityPlacements, ErrorHandler } from "../util/types"
import CustomError, { ErrorCode } from "../models/errors/CustomError"
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

        fetchPlacements()
        async function fetchPlacements() {
            try {
                const placements = await fetchActivityPlacements(activityId)
                setPlacements(placements)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.Placements)
            } finally {
                setLoading(false)
            }
        }
    }, [activityId])
    return { placements, isLoading }
}
