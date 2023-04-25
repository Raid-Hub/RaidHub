import {
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportEntry
} from "bungie-net-core/lib/models"
import { useEffect, useState } from "react"
import Activity from "../models/pgcr/Activity"
import { shared as client } from "../util/http/bungie"
import { Loading } from "../util/types"
import PGCRMember from "../models/pgcr/Member"

type UsePGCR = {
    members: PGCRMember[] | null
    activity: Activity | null
    loadingState: Loading
}

export function usePGCR(activityId: string | null | undefined): UsePGCR {
    const [pgcr, setPGCR] = useState<DestinyPostGameCarnageReportData | null>(null)
    const [loadingState, setLoading] = useState<Loading>(Loading.LOADING)

    useEffect(() => {
        setLoading(Loading.LOADING)
        const getPGCR = async () => {
            const pgcr = await client.getPGCR(activityId!)
            setLoading(Loading.HYDRATING)
            setPGCR(pgcr)
            const hydratedPGCR = await client.validatePGCR(pgcr)
            setPGCR(hydratedPGCR)
            setLoading(Loading.FALSE)
        }

        if (activityId) getPGCR()
        else if (activityId === null) setLoading(Loading.FALSE)
    }, [activityId])

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
