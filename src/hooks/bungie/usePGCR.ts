import {
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportEntry
} from "bungie-net-core/lib/models"
import { useCallback, useEffect, useState } from "react"
import Activity from "../../models/pgcr/Activity"
import { ErrorHandler, Loading } from "../../util/types"
import PGCRMember from "../../models/pgcr/Member"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"

type UsePGCRParams = {
    activityId: string | null | undefined
    errorHandler: ErrorHandler
}
type UsePGCR = {
    members: PGCRMember[] | null
    activity: Activity | null
    loadingState: Loading
}

export function usePGCR({ activityId, errorHandler }: UsePGCRParams): UsePGCR {
    const [pgcr, setPGCR] = useState<DestinyPostGameCarnageReportData | null>(null)
    const [loadingState, setLoading] = useState<Loading>(Loading.LOADING)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (id: string) => {
            return client.getPGCR(id)
        },
        [client]
    )

    const validateData = useCallback(
        async (data: DestinyPostGameCarnageReportData) => {
            return client.validatePGCR(data)
        },
        [client]
    )

    useEffect(() => {
        setLoading(Loading.LOADING)
        const getPGCR = async () => {
            try {
                const pgcr = await fetchData(activityId!)
                setPGCR(pgcr)
                setLoading(Loading.HYDRATING)
                const hydratedPGCR = await validateData(pgcr)
                setPGCR(hydratedPGCR)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.PGCRError)
            } finally {
                setLoading(Loading.FALSE)
            }
        }

        if (activityId) getPGCR()
        else if (activityId === null) setLoading(Loading.FALSE)
    }, [activityId, errorHandler, fetchData, validateData])

    if (!pgcr) return { members: null, activity: null, loadingState }

    const dict: Record<string, DestinyPostGameCarnageReportEntry[]> = {}
    /** Group characters by member */
    pgcr.entries.forEach(entry =>
        (dict[entry.player.destinyUserInfo.membershipId] ??= []).push(entry)
    )
    /** Sort each member's characters by latest start time, and always keep the completed one first*/
    const members: PGCRMember[] = Object.entries(dict)
        .map(
            ([_, vals]) =>
                new PGCRMember(
                    vals.sort((charA, charB) => {
                        if (charA.values.completed.basic.value) return -1
                        else if (charB.values.completed.basic.value) return 1
                        else
                            return (
                                charB.values.startSeconds.basic.value -
                                charA.values.startSeconds.basic.value
                            )
                        /* Sort member by completion then score */
                    })
                )
        )
        .sort((memA, memB) => {
            if ((!memA.didComplete || !memB.didComplete) && memA.didComplete != memB.didComplete)
                return !memA.didComplete ? 1 : -1
            else return memB.stats.score - memA.stats.score
        })
    const activity = new Activity(pgcr, members)
    return { members, activity, loadingState }
}
