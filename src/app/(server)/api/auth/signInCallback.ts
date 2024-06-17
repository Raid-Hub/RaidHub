import "server-only"

import { type AuthConfig } from "@auth/core/types"
import { type BungieProfile } from "./types"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"
import { updateDestinyProfiles } from "./updateDestinyProfiles"

export const signInCallback: Required<AuthConfig>["callbacks"]["signIn"] = async params => {
    // Only bungie users re-signing in will need to refresh their tokens
    if (
        params.account?.provider === "bungie" &&
        params.profile &&
        "createdAt" in params.user &&
        params.user.createdAt.getTime() > 0
    ) {
        await Promise.all([
            updateBungieAccessTokens({
                userId: params.account.providerAccountId,
                access: {
                    value: params.account.access_token!,
                    expires: new Date(params.account.expires_at! * 1000)
                },
                refresh: {
                    value: params.account.refresh_token!,
                    expires: new Date(Date.now() + params.account.refresh_expires_in! * 1000)
                }
            }),
            updateDestinyProfiles(params.profile as unknown as BungieProfile)
        ])
    }
    return true
}
