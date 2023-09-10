import BungieClient from "./client"
import { MembershipWithCharacters } from "~/types/profile"
import { getAllCharacterRaids } from "./getAllCharacterRaids"
import Activity from "~/models/profile/data/Activity"
import ActivityCollection from "~/models/profile/data/ActivityCollection"

export const getActivityHistory =
    (client: BungieClient) => async (memberships: MembershipWithCharacters[]) => {
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
                .reduce((accumulated, current) => Activity.combineCollections(accumulated, current))
                .sort((a, b) => b.endDate.getTime() - a.endDate.getTime())
        )

        const activitiesByRaid = ActivityCollection.groupActivities(
            activities.map(a => ({
                activityHash: a.activityDetails.directorActivityHash,
                values: a
            }))
        )

        return { allActivities: activities, activitiesByRaid }
    }
