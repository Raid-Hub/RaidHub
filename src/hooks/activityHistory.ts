import { Collection } from "@discordjs/collection"
import {
    BungieMembershipType,
    DestinyHistoricalStatsPeriodGroup,
} from "oodestiny/schemas"
import { useEffect, useState } from "react"
import { ACTIVITIES_PER_PAGE, shared as client } from "../util/http/bungie"
import { Raid, raidDetailsFromHash } from "../util/raid"
import { ActivityCollectionDictionary, ActivityHistory } from "../util/types"

type UseActivityHistoryParams = {
    membershipId: string
    membershipType: BungieMembershipType
    characterIds: string[]
}

type UseActivityHistory = {
    activities: ActivityHistory
    isLoading: boolean
}

export function useActivityHistory({
    membershipId,
    membershipType,
    characterIds,
}: UseActivityHistoryParams): UseActivityHistory {
    const [activities, setActivities] = useState<ActivityHistory>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const dict: ActivityCollectionDictionary = {
            [Raid.LEVIATHAN]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.EATER_OF_WORLDS]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.SPIRE_OF_STARS]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.LAST_WISH]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.SCOURGE_OF_THE_PAST]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.CROWN_OF_SORROW]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.GARDEN_OF_SALVATION]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.DEEP_STONE_CRYPT]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.VAULT_OF_GLASS]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.VOW_OF_THE_DISCIPLE]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.KINGS_FALL]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.ROOT_OF_NIGHTMARES]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
            [Raid.NA]: new Collection<
                string,
                DestinyHistoricalStatsPeriodGroup
            >(),
        }
        Promise.all(
            characterIds.map(async characterId => {
                let page = 0
                let hasMore = true
                while (hasMore) {
                    const newActivities = await client.getActivityHistory(
                        membershipId,
                        characterId,
                        membershipType,
                        page,
                    )
                    newActivities.forEach(activity => {
                        const info = raidDetailsFromHash(
                            activity.activityDetails.referenceId.toString(),
                        )
                        dict[info.raid].set(
                            activity.activityDetails.instanceId,
                            activity,
                        )
                    })
                    hasMore = newActivities.length == ACTIVITIES_PER_PAGE
                    page++
                }
            }),
        )
            .then(() => setActivities(dict))
            .finally(() => setLoading(false))
    }, [])
    return { activities, isLoading }
}
