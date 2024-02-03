import { BungieNetResponse, UserMembershipData } from "bungie-net-core/models"
import { TokenSet } from "next-auth"
import { OAuthConfig } from "next-auth/providers"
import { BungieAPIError } from "~/models/BungieAPIError"

export default function BungieProvider(creds: {
    apiKey: string
    clientId: string
    clientSecret: string
}): OAuthConfig<UserMembershipData> {
    return {
        id: "bungie",
        name: "Bungie",
        type: "oauth",
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        httpOptions: {
            headers: { "X-API-Key": creds.apiKey }
        },
        authorization: {
            url: "https://www.bungie.net/en/OAuth/Authorize",
            params: { scope: "" }
        },
        token: "https://www.bungie.net/platform/app/oauth/token/",
        userinfo: {
            // @ts-expect-error
            async request({ tokens }: { tokens: TokenSet }) {
                const res = await fetch(
                    "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
                    {
                        headers: {
                            "X-API-KEY": creds.apiKey,
                            Authorization: `Bearer ${tokens.access_token}`
                        }
                    }
                )
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
