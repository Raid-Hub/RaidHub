import { type TokenSet } from "@auth/core/types"
import type { BungieNetResponse, UserMembershipData } from "bungie-net-core/models"
import { type OAuth2Config } from "next-auth/providers"
import { BungieAPIError } from "~/models/BungieAPIError"

export default function BungieProvider(creds: {
    apiKey: string
    clientId: string
    clientSecret: string
}): OAuth2Config<UserMembershipData> {
    const userInfoUrl = "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/"
    return {
        id: "bungie",
        name: "Bungie",
        type: "oauth",
        checks: ["state"],
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        authorization: {
            url: "https://www.bungie.net/en/OAuth/Authorize",
            params: { scope: "" }
        },
        token: "https://www.bungie.net/platform/app/oauth/token/",
        userinfo: {
            url: userInfoUrl,
            async request({ tokens }: { tokens: TokenSet }) {
                const res = await fetch(userInfoUrl, {
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
        profile(data) {
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
                fresh: true
            }
        }
    }
}
