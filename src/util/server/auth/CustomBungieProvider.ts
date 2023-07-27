import { OAuthConfig, OAuthUserConfig } from "next-auth/providers"
import { bungieProfile } from "./bungieProfile"
import { BungieNetResponse } from "bungie-net-core/lib/api"
import { UserMembershipData } from "bungie-net-core/lib/models"

export default function CustomBungieProvider<P extends BungieNetResponse<UserMembershipData>>(
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
        profile: bungieProfile,
        options
    }
}
