import { BungieClientProtocol } from "bungie-net-core"
import { ACTIVITIES_PER_PAGE, getRaidHistoryPage } from "./getRaidHistoryPage"
import { Collection } from "@discordjs/collection"
import { BungieMembershipType } from "bungie-net-core/models"
import Activity from "~/models/profile/data/Activity"

/** Adds all raids into the dictionary */
export async function getAllCharacterRaids({
    destinyMembershipId,
    characterId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    characterId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<Collection<string, Activity>> {
    let allActivities = new Collection<string, Activity>()
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
        ).then(
            all =>
                new Collection(all.flat().map(a => [a.activityDetails.instanceId, new Activity(a)]))
        )

        if (!newActivities.size) break

        allActivities = Activity.combineCollections(newActivities, allActivities)

        hasMore = newActivities.size == ACTIVITIES_PER_PAGE * pages.length
        if (hasMore) {
            const raidsPerDay =
                (ACTIVITIES_PER_PAGE * pages.length) /
                ((newActivities.first()!.endDate.getTime() -
                    newActivities.last()!.startDate.getTime()) /
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
