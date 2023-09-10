import { BungieMembershipType } from "bungie-net-core/models"

export type CustomBungieSearchResult = {
    bungieGlobalDisplayName: string
    bungieGlobalDisplayNameCode?: number
    displayName: string
    membershipType: BungieMembershipType
    membershipId: string
}
