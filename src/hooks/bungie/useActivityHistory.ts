import { Collection } from "@discordjs/collection"
import { useCallback, useEffect, useState } from "react"
import { Raid } from "../../types/raids"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { ErrorHandler } from "../../types/generic"
import { getAllCharacterRaids } from "../../services/bungie/getAllCharacterRaids"
import { MembershipWithCharacters } from "../../types/profile"
import ActivityCollection from "../../models/profile/data/ActivityCollection"
import Activity from "../../models/profile/data/Activity"

type UseActivityHistory = (params: {
    characterMemberships: MembershipWithCharacters[] | null
    errorHandler: ErrorHandler
}) => {
    activitiesByRaid: Collection<Raid, ActivityCollection> | null
    allActivities: Collection<string, Activity> | null
    isLoading: boolean
}

export const useActivityHistory: UseActivityHistory = ({ characterMemberships, errorHandler }) => {
    const [activitiesByRaid, setActivitiesByRaid] = useState<Collection<
        Raid,
        ActivityCollection
    > | null>(null)
    const [allActivities, setAllActivities] = useState<Collection<string, Activity> | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (profiles: MembershipWithCharacters[]) => {
            setActivitiesByRaid(null)
            try {
                const activities = (
                    await Promise.all(
                        profiles.map(({ destinyMembershipId, membershipType, characterIds }) =>
                            Promise.all(
                                characterIds.map(characterId =>
                                    getAllCharacterRaids({
                                        characterId,
                                        destinyMembershipId,
                                        membershipType,
                                        client
                                    })
                                )
                            )
                        )
                    )
                )
                    .flat()
                    .reduce((accumulated, current) =>
                        Activity.combineCollections(accumulated, current)
                    )
                    .sort((a, b) => b.endDate.getTime() - a.endDate.getTime())
                setAllActivities(activities)

                setActivitiesByRaid(
                    ActivityCollection.groupActivities(
                        activities.map(a => ({
                            activityHash: a.activityDetails.directorActivityHash,
                            values: a
                        }))
                    )
                )
            } catch (e: any) {
                setError(e)
            } finally {
                setLoading(false)
            }
        },
        [client]
    )

    useEffect(() => {
        error && CustomError.handle(errorHandler, error, ErrorCode.ActivityHistory)
    }, [error, errorHandler])

    useEffect(() => {
        if (characterMemberships) {
            setLoading(true)
            fetchData(characterMemberships)
        } else {
            setLoading(false)
        }
    }, [characterMemberships, fetchData])
    return { activitiesByRaid, allActivities, isLoading }
}
