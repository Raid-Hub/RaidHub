import { getLinkedProfiles as getBungieLinkedProfiles } from "bungie-net-core/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core"

export const getLinkedProfiles = {
    key: "linked-profile",
    fn:
        (client: BungieClientProtocol) =>
        async ({ membershipId }: { membershipId: string }) => {
            const { Response } = await getBungieLinkedProfiles(client, {
                membershipId,
                membershipType: -1 // all
            })
            return Response
        }
}
