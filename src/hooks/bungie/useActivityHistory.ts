import { Collection } from "@discordjs/collection"
import { BungieMembershipType, DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import { useCallback, useEffect, useState } from "react"
import { ACTIVITIES_PER_PAGE } from "../../util/bungieClient"
import { Raid, raidDetailsFromHash } from "../../util/raid"
import { ActivityCollectionDictionary, ActivityHistory, ErrorHandler } from "../../util/types"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"

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
    console.log("a")

    const getActivityHistory = useCallback(
        async (
            membershipId: string,
            characterId: string,
            membershipType: BungieMembershipType,
            page: number
        ) => {
            return client.getActivityHistory(membershipId, characterId, membershipType, page)
        },
        [client]
    )

    useEffect(() => {
        console.log("333")
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
                console.log("111")
                setActivities(dict)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.ActivityHistory)
            } finally {
                console.log("222")
                setLoading(false)
            }
        }
    }, [membershipId, membershipType, characterIds, errorHandler, getActivityHistory])
    return { activities, isLoading }
}
