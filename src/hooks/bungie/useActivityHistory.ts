import { Collection } from "@discordjs/collection"
import { BungieMembershipType, DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/models"
import { useCallback, useEffect, useState } from "react"
import { Raid, raidDetailsFromHash } from "../../util/destiny/raid"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"
import { ACTIVITIES_PER_PAGE, getRaidHistoryPage } from "../../services/bungie/getRaidHistoryPage"
import { ErrorHandler } from "../../types/generic"
import { ActivityCollectionDictionary, ActivityHistory } from "../../types/profile"

type UseActivityHistoryParams = {
    membershipId: string
    membershipType: BungieMembershipType
    characterIds: string[] | null
    errorHandler: ErrorHandler
}

type UseActivityHistory = {
    activities: ActivityHistory
    isLoading: boolean
}

export function useActivityHistory({
    membershipId,
    membershipType,
    characterIds,
    errorHandler
}: UseActivityHistoryParams): UseActivityHistory {
    const [activities, setActivities] = useState<ActivityHistory>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const getActivityHistory = useCallback(
        async (
            destinyMembershipId: string,
            characterId: string,
            membershipType: BungieMembershipType,
            page: number
        ) => getRaidHistoryPage({ destinyMembershipId, characterId, membershipType, page, client }),
        [client]
    )

    useEffect(() => {
        setLoading(true)
        const dict: ActivityCollectionDictionary = {
            [Raid.LEVIATHAN]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.EATER_OF_WORLDS]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.SPIRE_OF_STARS]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.LAST_WISH]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.SCOURGE_OF_THE_PAST]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.CROWN_OF_SORROW]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.GARDEN_OF_SALVATION]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.DEEP_STONE_CRYPT]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.VAULT_OF_GLASS]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.VOW_OF_THE_DISCIPLE]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.KINGS_FALL]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.ROOT_OF_NIGHTMARES]: new Collection<string, DestinyHistoricalStatsPeriodGroup>(),
            [Raid.NA]: new Collection<string, DestinyHistoricalStatsPeriodGroup>()
        }
        if (characterIds) getActivities(characterIds)

        async function getActivities(ids: string[]) {
            try {
                await Promise.all(
                    ids.map(async characterId => {
                        let page = 0
                        let hasMore = true
                        while (hasMore) {
                            const newActivities = await getActivityHistory(
                                membershipId,
                                characterId,
                                membershipType,
                                page
                            )
                            newActivities.forEach(activity => {
                                const info = raidDetailsFromHash(
                                    activity.activityDetails.referenceId.toString()
                                )
                                dict[info.raid].set(activity.activityDetails.instanceId, activity)
                            })
                            hasMore = newActivities.length == ACTIVITIES_PER_PAGE
                            page++
                        }
                    })
                )
                setActivities(dict)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.ActivityHistory)
            } finally {
                setLoading(false)
            }
        }
    }, [membershipId, membershipType, characterIds, errorHandler, getActivityHistory])
    return { activities, isLoading }
}
