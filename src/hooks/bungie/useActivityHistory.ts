import { useCallback } from "react"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { ErrorHandler } from "../../types/generic"
import { getAllCharacterRaids } from "../../services/bungie/getAllCharacterRaids"
import { MembershipWithCharacters } from "../../types/profile"
import ActivityCollection from "../../models/profile/data/ActivityCollection"
import Activity from "../../models/profile/data/Activity"
import { useQuery } from "@tanstack/react-query"

export function useActivityHistory({
    characterMemberships,
    errorHandler
}: {
    characterMemberships: MembershipWithCharacters[] | null
    errorHandler: ErrorHandler
}) {
    const client = useBungieClient()

    const fetchData = useCallback(
        async (memberships: MembershipWithCharacters[] | null) => {
            if (!memberships) {
                return null
            }
            const activities = await Promise.all(
                memberships.map(({ destinyMembershipId, membershipType, characterIds }) =>
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
            ).then(all =>
                all
                    .flat()
                    .reduce((accumulated, current) =>
                        Activity.combineCollections(accumulated, current)
                    )
                    .sort((a, b) => b.endDate.getTime() - a.endDate.getTime())
            )

            const activitiesByRaid = ActivityCollection.groupActivities(
                activities.map(a => ({
                    activityHash: a.activityDetails.directorActivityHash,
                    values: a
                }))
            )

            return { allActivities: activities, activitiesByRaid }
        },
        [client]
    )

    return useQuery({
        queryKey: ["activityHistory", characterMemberships],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.ActivityHistory),
        queryFn: () => fetchData(characterMemberships),
        staleTime: 2 * 60000 // activity history changes every few mins
    })
}
