import "server-only"

import type { Profile } from "@prisma/client"
import type { UserMembershipData } from "bungie-net-core/models"
import type { CallbacksOptions } from "next-auth"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"

export const signInCallback: CallbacksOptions<UserMembershipData | Profile>["signIn"] = async ({
    account,
    user
}) => {
    // Users from the bungie callback will already have a bungieAccessToken
    if (account?.provider === "bungie" && !("bungieAccessToken" in user)) {
        await updateBungieAccessTokens({
            userId: user.id,
            access: {
                value: account.access_token!,
                expires: new Date(account.expires_at! * 1000)
            },
            refresh: {
                value: account.refresh_token!,
                expires: new Date(Date.now() + 7_775_777_777)
            }
        })
    }
    return true
}
