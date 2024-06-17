import { type Adapter } from "@auth/core/adapters"
import { type TokenSet } from "@auth/core/types"
import type { BungieNetResponse, UserMembershipData } from "bungie-net-core/models"
import { type OAuth2Config } from "next-auth/providers"
import { BungieAPIError } from "~/models/BungieAPIError"
import { type BungieProfile } from "../types"

export default function BungieProvider(creds: {
    apiKey: string
    clientId: string
    clientSecret: string
}): OAuth2Config<BungieProfile> {
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
        profile(data): Parameters<Required<Adapter>["createUser"]>[0] & {
            userMembershipData: UserMembershipData
        } {
            return {
                id: data.bungieNetUser.membershipId,
                role: "USER",
                name: data.bungieNetUser.displayName,
                image: `https://www.bungie.net${
                    data.bungieNetUser.profilePicturePath.startsWith("/") ? "" : "/"
                }${data.bungieNetUser.profilePicturePath}`,
                userMembershipData: data
            }
        }
    }
}
