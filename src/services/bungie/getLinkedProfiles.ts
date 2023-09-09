import { getLinkedProfiles as getBungieLinkedProfiles } from "bungie-net-core/endpoints/Destiny2"
import BungieClient from "./client"

export const getLinkedProfiles =
    (client: BungieClient) =>
    async ({ membershipId }: { membershipId: string }) => {
        const { Response } = await getBungieLinkedProfiles(client, {
            membershipId,
            membershipType: -1 // all
        })
        return Response
    }
