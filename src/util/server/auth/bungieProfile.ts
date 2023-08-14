import { BungieNetResponse } from "bungie-net-core/lib/api"
import { UserMembershipData } from "bungie-net-core/lib/models"
import { TokenSet } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { v4 } from "uuid"

export async function bungieProfile(
    { Response }: BungieNetResponse<UserMembershipData>,
    tokens: TokenSet
): Promise<AdapterUser> {
    const { bungieNetUser, destinyMemberships, primaryMembershipId } = Response
    const primaryDestinyMembership =
        destinyMemberships.find(membership => membership.membershipId === primaryMembershipId) ??
        destinyMemberships[0]

    return {
        id: primaryDestinyMembership.membershipId,
        name: primaryDestinyMembership.displayName,
        destinyMembershipId: primaryDestinyMembership.membershipId,
        destinyMembershipType: primaryDestinyMembership.membershipType,
        bungieUsername: primaryDestinyMembership.bungieGlobalDisplayNameCode
            ? primaryDestinyMembership.bungieGlobalDisplayName +
              "#" +
              primaryDestinyMembership.bungieGlobalDisplayNameCode
            : null,
        discordUsername: null,
        twitchUsername: bungieNetUser.twitchDisplayName ?? null,
        twitterUsername: null,
        image: `https://www.bungie.net${
            bungieNetUser.profilePicturePath.startsWith("/") ? "" : "/"
        }${bungieNetUser.profilePicturePath}`,
        pinnedActivityId: null,
        profileDecoration: null,
        bungieAccessToken: {
            id: v4(),
            destinyMembershipId: primaryDestinyMembership.membershipId,
            value: tokens.access_token!,
            expires: new Date(tokens.expires_at! * 1000)
        },
        bungieRefreshToken: {
            id: v4(),
            destinyMembershipId: primaryDestinyMembership.membershipId,
            value: tokens.refresh_token!,
            expires: new Date(Date.now() + 7_775_777_777)
        },
        email: "",
        emailVerified: null
    }
}
