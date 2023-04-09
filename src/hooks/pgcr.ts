import { DestinyPostGameCarnageReportData, DestinyPostGameCarnageReportEntry } from "oodestiny/schemas"
import { useEffect, useState } from "react"
import { Activity } from "../models/pgcr/Activity"
import { PGCRMember } from "../models/pgcr/Entry"
import { shared as client } from "../util/http/bungie"

type UsePGCR = {
    members: PGCRMember[] | null
    activity: Activity | null
    error: string | null
    isLoading: boolean
}

export function usePGCR(activityId: string): UsePGCR {
    const [pgcr, setPGCR] = useState<DestinyPostGameCarnageReportData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        client.getPGCR(activityId)
            .then(pgcr => client.validatePGCR(pgcr))
            .then(validatedPGCR => setPGCR(validatedPGCR))
            //.catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [activityId])
    
    if (isLoading || !pgcr) return { members: null, activity: null, error, isLoading }

    const dict: Record<string, DestinyPostGameCarnageReportEntry[]> = {}
    /** Group characters by member */
    pgcr.entries.forEach(entry => (dict[entry.player.destinyUserInfo.membershipId] ??= []).push(entry))
    /** Sort each member's characters by latest start time, and always keep the completed one first*/
    const members: PGCRMember[] = Object.entries(dict).map(([_, vals]) => new PGCRMember(vals.sort((charA, charB) => {
        if (charA.values.completed.basic.value) return -1;
        else if (charB.values.completed.basic.value) return 1;
        else return charB.values.startSeconds.basic.value - charA.values.startSeconds.basic.value
        /* Sort member by completion then score */
    }))).sort((memA, memB) => {
        if ((!memA.didComplete || !memB.didComplete) && (memA.didComplete != memB.didComplete)) return !memA.didComplete ? 1 : -1
        else return memB.stats.score - memA.stats.score
    })
    const activity = new Activity(pgcr, members)
    return { members, activity, error, isLoading }
}