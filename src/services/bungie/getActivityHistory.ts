import { CharacterWithMembership } from "~/types/profile"
import { getAllCharacterRaids } from "./getAllCharacterRaids"
import Activity from "~/models/profile/data/Activity"
import { BungieClientProtocol } from "bungie-net-core"

export const getActivityHistory = {
    key: "activity-history",
    fn: (client: BungieClientProtocol) => async (memberships: CharacterWithMembership[]) => {
        const allActivities = await Promise.all(
            memberships.map(({ destinyMembershipId, membershipType, characterId }) =>
                getAllCharacterRaids({
                    characterId,
                    destinyMembershipId,
                    membershipType,
                    client
                })
            )
        ).then(all =>
            all
                .reduce((accumulated, current) => Activity.combineCollections(accumulated, current))
                .sort((a, b) => b.endDate.getTime() - a.endDate.getTime())
        )

        return allActivities
    }
}
