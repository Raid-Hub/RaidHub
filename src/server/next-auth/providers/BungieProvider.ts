import { BungieNetResponse, UserMembershipData } from "bungie-net-core/models"
import { TokenSet } from "@auth/core/types"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import { OAuth2Config, OAuthConfig } from "@auth/core/providers"

export default function BungieProvider(creds: {
    apiKey: string
    clientId: string
    clientSecret: string
}): OAuth2Config<UserMembershipData> {
    return {
        id: "bungie",
        name: "Bungie",
        type: "oauth",
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        authorization: {
            url: "https://www.bungie.net/en/OAuth/Authorize",
            headers: { "X-API-Key": creds.apiKey },
            params: { scope: "" }
        },
        token: "https://www.bungie.net/platform/app/oauth/token/",
        userinfo: {
            url: "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
            async request({ tokens, provider }: { tokens: TokenSet; provider: OAuthConfig<any> }) {
                const res = await fetch(provider.userinfo.url, {
                    headers: {
                        "X-API-KEY": creds.apiKey,
                        Authorization: `Bearer ${tokens.access_token}`
                    }
                })
                const data = (await res.json()) as BungieNetResponse<UserMembershipData>
                if (!res.ok) {
                    throw new BungieAPIError(data)
                } else {
                    return data.Response
                }
            }
        },
        profile(data, tokens: TokenSet) {
            const { bungieNetUser, destinyMemberships, primaryMembershipId } = data
            const primaryDestinyMembership =
                destinyMemberships.find(
                    membership => membership.membershipId === primaryMembershipId
                ) ?? destinyMemberships[0]

            return {
                id: bungieNetUser.membershipId,
                name: primaryDestinyMembership.displayName,
                bungieMembershipId: bungieNetUser.membershipId,
                destinyMembershipId: primaryDestinyMembership.membershipId,
                destinyMembershipType: primaryDestinyMembership.membershipType,
                bungieUsername: primaryDestinyMembership.bungieGlobalDisplayNameCode
                    ? primaryDestinyMembership.bungieGlobalDisplayName +
                      "#" +
                      primaryDestinyMembership.bungieGlobalDisplayNameCode
                    : null,
                twitchUsername: bungieNetUser.twitchDisplayName ?? null,
                image: `https://www.bungie.net${
                    bungieNetUser.profilePicturePath.startsWith("/") ? "" : "/"
                }${bungieNetUser.profilePicturePath}`,
                role: "USER",
                email: null,
                emailVerified: null,
                bungieAccessToken: {
                    bungieMembershipId: bungieNetUser.membershipId,
                    value: tokens.access_token!,
                    expires: new Date(tokens.expires_at! * 1000)
                },
                bungieRefreshToken: {
                    bungieMembershipId: bungieNetUser.membershipId,
                    value: tokens.refresh_token!,
                    expires: new Date(Date.now() + 7_775_777_777) // <90 days
                }
            }
        }
    }
}
