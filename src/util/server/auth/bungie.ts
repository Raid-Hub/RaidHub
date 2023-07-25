import { User } from "@prisma/client"
import { BungieNetResponse } from "bungie-net-core/lib/api"
import { UserMembershipData } from "bungie-net-core/lib/models"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

export async function parseMembershipsResponse(
    res: BungieNetResponse<UserMembershipData>
): Promise<User> {
    const { bungieNetUser, destinyMemberships, primaryMembershipId } = res.Response
    const primaryDestinyMembership =
        destinyMemberships.find(membership => membership.membershipId === primaryMembershipId) ??
        destinyMemberships[0]

    return {
        id: primaryDestinyMembership.membershipId,
        name:
            primaryDestinyMembership.bungieGlobalDisplayName ??
            primaryDestinyMembership.displayName,
        destinyMembershipId: primaryDestinyMembership.membershipId,
        destinyMembershipType: primaryDestinyMembership.membershipType,
        bungie_access_token: null,
        bungie_access_expires_at: null,
        bungie_refresh_token: null,
        bungie_refresh_expires_at: null,
        image: `https://www.bungie.net${
            bungieNetUser.profilePicturePath.startsWith("/") ? "" : "/"
        }${bungieNetUser.profilePicturePath}`,
        email: null,
        emailVerified: null
    }
}

export function CustomBungieProvider<P extends BungieNetResponse<UserMembershipData>>(
    options: OAuthUserConfig<P>
): OAuthConfig<P> {
    return {
        id: "bungie",
        name: "Bungie",
        type: "oauth",
        httpOptions: { headers: { "X-API-Key": process.env.BUNGIE_API_KEY } },
        authorization: {
            url: "https://www.bungie.net/en/OAuth/Authorize",
            params: { scope: "" }
        },
        token: "https://www.bungie.net/platform/app/oauth/token/",
        userinfo: "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
        profile: parseMembershipsResponse,
        options
    }
}
