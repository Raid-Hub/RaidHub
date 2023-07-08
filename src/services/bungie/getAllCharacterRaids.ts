import { BungieClientProtocol } from "bungie-net-core/lib/client"
import { ActivityCollectionDictionary } from "../../types/profile"
import { BungieMembershipType, DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import { ACTIVITIES_PER_PAGE, getRaidHistoryPage } from "./getRaidHistoryPage"
import { raidTupleFromHash } from "../../util/destiny/raid"

/** Adds all raids into the dictionary */
export async function getAllCharacterRaids({
    destinyMembershipId,
    characterId,
    membershipType,
    client,
    dict
}: {
    destinyMembershipId: string
    characterId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
    dict: ActivityCollectionDictionary
}): Promise<DestinyHistoricalStatsPeriodGroup[]> {
    const allActivities: DestinyHistoricalStatsPeriodGroup[] = []
    let pages = [0]
    let hasMore = true
    while (hasMore) {
        const newActivities = await Promise.all(
            pages.map(page =>
                getRaidHistoryPage({
                    destinyMembershipId,
                    characterId,
                    membershipType,
                    page,
                    client
                })
            )
        ).then(all => all.flat())

        if (!newActivities.length) break

        newActivities.forEach(activity => {
            const [raid] = raidTupleFromHash(activity.activityDetails.referenceId.toString())
            if (
                !dict[raid].has(activity.activityDetails.instanceId) ||
                !!activity.values.completed.basic.value
            ) {
                allActivities.push(activity)
                dict[raid].set(activity.activityDetails.instanceId, activity)
            }
        })
        hasMore = newActivities.length == ACTIVITIES_PER_PAGE * pages.length
        if (hasMore) {
            const raidsPerDay =
                (ACTIVITIES_PER_PAGE * pages.length) /
                ((new Date(newActivities[0].period).getTime() -
                    new Date(newActivities[newActivities.length - 1].period).getTime()) /
                    86_400_000) /** ms per day*/

            const estimate = Math.ceil(Math.sqrt(raidsPerDay))
            const lastPage = pages[pages.length - 1]
            pages = []
            for (let i = 1; i <= estimate; i++) {
                pages.push(lastPage + i)
            }
        }
    }
    return allActivities
}
