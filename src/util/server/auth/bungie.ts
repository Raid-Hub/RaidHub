import { User } from "@prisma/client"
import { BungieNetResponse } from "bungie-net-core/lib/api"
import { UserMembershipData } from "bungie-net-core/lib/models"
import { Awaitable } from "next-auth"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

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
        profile(res, tokens): Awaitable<User> {
            const { bungieNetUser, destinyMemberships, primaryMembershipId } = res.Response
            const primaryDestinyMembership =
                destinyMemberships.find(
                    membership => membership.membershipId === primaryMembershipId
                ) ?? destinyMemberships[0]

            return {
                id: primaryDestinyMembership.membershipId,
                name:
                    primaryDestinyMembership.bungieGlobalDisplayName ??
                    primaryDestinyMembership.displayName,
                destinyMembershipId: primaryDestinyMembership.membershipId,
                destinyMembershipType: primaryDestinyMembership.membershipType,
                image: `https://www.bungie.net${
                    bungieNetUser.profilePicturePath.startsWith("/") ? "" : "/"
                }${bungieNetUser.profilePicturePath}`,
                bungie_access_token: tokens.access_token!,
                bungie_access_expires_at: new Date(Date.now() + 3_600_000),
                bungie_refresh_token: tokens.refresh_token!,
                bungie_refresh_expires_at: new Date(Date.now() + 7_776_000_000),
                email: null,
                emailVerified: null
            }
        },
        options
    }
}
