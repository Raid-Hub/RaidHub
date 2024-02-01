import { BungieMembershipType, GroupV2 } from "bungie-net-core/models"
import { z } from "zod"
import { SVGProps } from "~/components/reusable/SVG"
import { zModifiableProfile } from "~/util/zod"
import Activity from "../models/profile/data/Activity"
import { Socials } from "../util/profile/socials"
import { FilterCallback } from "./generic"

export type InitialProfileProps = {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
}
export type ProfileDetail = { destinyMembershipId: string; membershipType: BungieMembershipType }

export type ClanBannerData = {
    decalPrimary: ClanBannerDataPart
    decalSecondary: ClanBannerDataPart
    gonfalcons: ClanBannerDataPart
    decalTop: ClanBannerDataPart
}
type ClanBannerDataPart = {
    path: string
    color: string
}
export type Clan = GroupV2 & { clanBanner: ClanBannerData | null }
export type CharacterWithMembership = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    characterId: string
}

export type RaidHubProfile = {
    displayName: string
    icon: string
    vanityString: string | null
    socials: ProfileSocialData[]
    pinnedActivity: string | null
    background: string | null
}

export type ProfileSocialData = {
    id: Socials
    Icon: React.FC<SVGProps>
    displayName: string
    url?: string | null
}

export interface ActivityFilter {
    id: string
    predicate: FilterCallback<Activity>
    stringify(): string
    encode(): Object
    deepClone(): ActivityFilter
}

export type zModifiableProfile = Partial<z.infer<typeof zModifiableProfile>>
