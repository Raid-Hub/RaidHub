import type { DestinyProfileResponse } from "bungie-net-core/models/Destiny/Responses/DestinyProfileResponse"
import { type RaidHubPlayerInfo, type RaidHubPlayerProfileResponse } from "~/services/raidhub/types"
import type { AppProfile } from "~/types/api"

export type ProfileProps = {
    destinyMembershipId: string
    destinyMembershipType: number
    ssrAppProfile: AppProfile | null
    ssrRaidHubBasic?: RaidHubPlayerInfo | null
    ssrRaidHubProfile?: RaidHubPlayerProfileResponse | null
    ssrDestinyProfile?: DestinyProfileResponse<[100, 200]> | null
    ready: boolean
}
