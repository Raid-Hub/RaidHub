import type { CallbacksOptions } from "@auth/core/types"
import type { Profile } from "@prisma/client"
import type { UserMembershipData } from "bungie-net-core/models"
import { updateBungieAccessTokens } from "../updateBungieAccessTokens"

export const signInCallback: CallbacksOptions<UserMembershipData | Profile>["signIn"] = async ({
    account,
    user,
    profile
}) => {
    // Users from the callback will have no user, while users from the DB will exist
    if (account?.provider === "bungie" && user?.id && profile && "bungieNetUser" in profile) {
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

        throw new Error("Not ready for this yet, TODO")
    }
    return true
}
