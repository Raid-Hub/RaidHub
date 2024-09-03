import { type Adapter } from "@auth/core/adapters"
import { type TokenSet } from "@auth/core/types"
import { type BungieFetchConfig } from "bungie-net-core"
import { getMembershipDataForCurrentUser } from "bungie-net-core/endpoints/User"
import type { UserMembershipData } from "bungie-net-core/models"
import { type OAuth2Config } from "next-auth/providers"
import ServerBungieClient from "~/server/serverBungieClient"
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
                const res = await getMembershipDataForCurrentUser(
                    new AuthBungieClient(tokens.access_token!)
                )
                return res.Response
            }
        },
        profile(data): Parameters<Required<Adapter>["createUser"]>[0] & {
            userMembershipData: UserMembershipData
            id: string
        } {
            return {
                /**
                 * The `id` returned here is overriden prior to the `createUser` function in the adapter.
                 * However, it is used as the `providerAccountId` to create an account.
                 */
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

class AuthBungieClient extends ServerBungieClient {
    private authToken: string
    constructor(authToken: string) {
        super()
        this.authToken = authToken
    }

    generatePayload(config: BungieFetchConfig): RequestInit & { headers: Headers } {
        const payload = super.generatePayload(config)
        payload.headers.set("Authorization", `Bearer ${this.authToken}`)
        return payload
    }
}
