import { Difficulty, Raid } from "./raids"
import { Socials } from "../util/profile/socials"
import { GroupV2 } from "bungie-net-core/models"
import { ClanBannerData } from "../util/destiny/parseClanBanner"
import Activity from "../models/profile/data/Activity"
import { FilterCallback } from "./generic"
import { z } from "zod"
import { BungieMembershipType } from "bungie-net-core/models"
import { zModifiableProfile } from "~/util/zod"
import { SVGProps } from "~/components/reusable/SVG"

export type InitialProfileProps = {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
}
export type ProfileDetail = { destinyMembershipId: string; membershipType: BungieMembershipType }
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
    url?: string
}

export type RaidTag = {
    raid: Raid
    instanceId: string
    playerCount: number
    flawless: boolean
    fresh: boolean | null
    difficulty: Difficulty
    bestPossible: boolean
}

export type RaceTag = {
    placement?: number
    asterisk?: boolean
    raid: Raid
    challenge: boolean
    dayOne: boolean
    contest: boolean
    weekOne: boolean
}

export interface ActivityFilter {
    id: string
    predicate: FilterCallback<Activity>
    stringify(): string
    encode(): Object
    deepClone(): ActivityFilter
}

export type zModifiableProfile = Partial<z.infer<typeof zModifiableProfile>>
