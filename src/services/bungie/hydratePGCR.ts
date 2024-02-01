import { Collection } from "@discordjs/collection"
import { BungieClientProtocol } from "bungie-net-core"
import { DestinyCharacterComponent, UserInfoCard } from "bungie-net-core/models"
import DestinyPGCR from "../../util/destiny/PGCR"
import { getDestinyCharacter } from "./getDestinyCharacter"

export async function hydratePGCR({
    activity,
    client
}: {
    activity: DestinyPGCR
    client: BungieClientProtocol
}) {
    const hydrationData = new Collection<string, [UserInfoCard, DestinyCharacterComponent | null]>()
    if (activity.entries.length < 50) {
        await Promise.all(
            activity.entries.map(async entry => {
                let destinyUserInfo = entry.player.destinyUserInfo
                // if (!entry.player.destinyUserInfo.membershipType) {
                //     destinyUserInfo = await getLinkedDestinyProfile({
                //         membershipId: entry.player.destinyUserInfo.membershipId,
                //         client
                //     })
                // }

                const character = await getDestinyCharacter({
                    destinyMembershipId: destinyUserInfo.membershipId,
                    membershipType: destinyUserInfo.membershipType,
                    characterId: entry.characterId,
                    client
                }).catch(deleted => null)

                hydrationData.set(entry.characterId, [destinyUserInfo, character])
            })
        )
    }
    // activity.hydrate(hydrationData)
    return activity
}
