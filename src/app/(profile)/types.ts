import type { DestinyProfileResponse } from "bungie-net-core/models/Destiny/Responses/DestinyProfileResponse"
import type { SVGWrapperProps } from "~/components/SVG"
import type { AppProfile } from "~/types/api"
import type { RaidHubPlayerResponse } from "~/types/raidhub-api"
import type { Socials } from "~/util/profile/socials"

export type ProfileSocialData = {
    id: Socials
    Icon: React.FC<SVGWrapperProps>
    displayName: string
    url?: string | null
}

export type ProfileProps = {
    destinyMembershipId: string
    destinyMembershipType: number
    ssrAppProfile: AppProfile | null
    ssrRaidHubProfile?: RaidHubPlayerResponse | null
    ssrDestinyProfile?: DestinyProfileResponse<[100, 200]> | null
    ready: boolean
}
