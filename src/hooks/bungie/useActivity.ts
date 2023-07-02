import { useCallback, useEffect, useState } from "react"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"
import { getPGCR } from "../../services/bungie/getPGCR"
import DestinyPGCR from "../../models/pgcr/PGCR"

type useActivityParams = {
    activityId: string | null | undefined
    errorHandler: ErrorHandler
}
type UseActivity = {
    pgcr: DestinyPGCR | null
    isLoading: boolean
}

export function useActivity({ activityId, errorHandler }: useActivityParams): UseActivity {
    const [pgcr, setPGCR] = useState<DestinyPGCR | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (activityId: string) => getPGCR({ activityId, client }),
        [client]
    )

    useEffect(() => {
        setIsLoading(true)

        if (activityId) getPGCR()
        else if (activityId === null) setIsLoading(false)

        async function getPGCR() {
            setPGCR(null)
            try {
                const pgcr = await fetchData(activityId!)
                setPGCR(pgcr)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.PGCRError)
            } finally {
                setIsLoading(false)
            }
        }
    }, [activityId, errorHandler, fetchData])

    return { pgcr, isLoading }
}
