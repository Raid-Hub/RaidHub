import { CharacterWithMembership } from "~/types/profile"
import BungieClient from "../../util/bungieClient"
import { getAllCharacterRaids } from "./getAllCharacterRaids"
import Activity from "~/models/profile/data/Activity"
import ActivityCollection from "~/models/profile/data/ActivityCollection"

export const getActivityHistory =
    (client: BungieClient) => async (memberships: CharacterWithMembership[]) => {
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

        const activitiesByRaid = ActivityCollection.groupActivities(
            allActivities.map(a => ({
                activityHash: a.activityDetails.directorActivityHash,
                values: a
            }))
        )

        return { allActivities, activitiesByRaid }
    }
