import { User } from "@prisma/client"
import { BungieNetResponse } from "bungie-net-core/lib/api"
import { UserMembershipData } from "bungie-net-core/lib/models"

export async function bungieProfile({
    Response
}: BungieNetResponse<UserMembershipData>): Promise<User> {
    const { bungieNetUser, destinyMemberships, primaryMembershipId } = Response
    const primaryDestinyMembership =
        destinyMemberships.find(membership => membership.membershipId === primaryMembershipId) ??
        destinyMemberships[0]

    return {
        id: primaryDestinyMembership.membershipId,
        name: primaryDestinyMembership.displayName,
        destiny_membership_id: primaryDestinyMembership.membershipId,
        destiny_membership_type: primaryDestinyMembership.membershipType,
        discord_username: null,
        twitch_username: null,
        twitter_username: null,
        bungie_username: primaryDestinyMembership.bungieGlobalDisplayNameCode
            ? primaryDestinyMembership.bungieGlobalDisplayName +
              "#" +
              primaryDestinyMembership.bungieGlobalDisplayNameCode
            : null,
        bungie_access_token: null,
        bungie_access_expires_at: null,
        bungie_refresh_token: null,
        bungie_refresh_expires_at: null,
        image: `https://www.bungie.net${
            bungieNetUser.profilePicturePath.startsWith("/") ? "" : "/"
        }${bungieNetUser.profilePicturePath}`,
        email: null
    }
}
