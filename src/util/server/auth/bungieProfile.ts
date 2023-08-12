import { User } from "@prisma/client"
import { BungieNetResponse } from "bungie-net-core/lib/api"
import { UserMembershipData } from "bungie-net-core/lib/models"
import { TokenSet } from "next-auth"

export async function bungieProfile(
    { Response }: BungieNetResponse<UserMembershipData>,
    tokens: TokenSet
): Promise<User> {
    const { bungieNetUser, destinyMemberships, primaryMembershipId } = Response
    const primaryDestinyMembership =
        destinyMemberships.find(membership => membership.membershipId === primaryMembershipId) ??
        destinyMemberships[0]

    console.log(bungieNetUser)

    return {
        id: primaryDestinyMembership.membershipId,
        name: primaryDestinyMembership.displayName,
        destiny_membership_id: primaryDestinyMembership.membershipId,
        destiny_membership_type: primaryDestinyMembership.membershipType,
        bungie_username: primaryDestinyMembership.bungieGlobalDisplayNameCode
            ? primaryDestinyMembership.bungieGlobalDisplayName +
              "#" +
              primaryDestinyMembership.bungieGlobalDisplayNameCode
            : null,
        bungie_access_token: tokens.access_token!,
        bungie_access_expires_at: new Date(tokens.expires_at!),
        bungie_refresh_token: tokens.refresh_token!,
        bungie_refresh_expires_at: new Date(Date.now() + 7_775_777_777),
        discord_username: null,
        twitch_username: bungieNetUser.twitchDisplayName ?? null,
        twitter_username: null,
        image: `https://www.bungie.net${
            bungieNetUser.profilePicturePath.startsWith("/") ? "" : "/"
        }${bungieNetUser.profilePicturePath}`,
        email: null,
        pinned_activity_id: null,
        profile_decoration: null
    }
}
