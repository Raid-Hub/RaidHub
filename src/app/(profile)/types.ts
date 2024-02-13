import type { DestinyProfileResponse } from "bungie-net-core/models/Destiny/Responses/DestinyProfileResponse"
import type { AppProfile } from "~/types/api"
import type { RaidHubPlayerResponse } from "~/types/raidhub-api"

export type ProfileProps = {
    destinyMembershipId: string
    destinyMembershipType: number
    ssrAppProfile: AppProfile | null
    ssrRaidHubProfile?: RaidHubPlayerResponse | null
    ssrDestinyProfile?: DestinyProfileResponse<[100, 200]> | null
    ready: boolean
}
