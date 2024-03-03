import type { DestinyProfileResponse } from "bungie-net-core/models/Destiny/Responses/DestinyProfileResponse"
import type { RaidHubPlayerResponse } from "~/services/raidhub/types"
import type { AppProfile } from "~/types/api"

export type ProfileProps = {
    destinyMembershipId: string
    destinyMembershipType: number
    ssrAppProfile: AppProfile | null
    ssrRaidHubProfile?: RaidHubPlayerResponse | null
    ssrDestinyProfile?: DestinyProfileResponse<[100, 200]> | null
    ready: boolean
}
