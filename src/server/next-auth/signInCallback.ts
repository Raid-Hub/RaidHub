import type { CallbacksOptions } from "@auth/core/types"
import { updateBungieAccessTokens } from "./providers/updateBungieAccessTokens"
import { UserMembershipData } from "bungie-net-core/models"
import { Profile } from "@prisma/client"

export const signInCallback: CallbacksOptions<UserMembershipData | Profile>["signIn"] = async ({
    account,
    user,
    profile
}) => {
    // Users from the callback will have no user, while users from the DB will exist
    if (account?.provider === "bungie" && user && profile && "bungieNetUser" in profile) {
        await updateBungieAccessTokens({
            bungieMembershipId: profile.bungieNetUser.membershipId,
            access: {
                value: account.access_token!,
                expires: new Date(account.expires_at! * 1000)
            },
            refresh: {
                value: account.refresh_token!,
                expires: new Date(Date.now() + 7_775_777_777)
            }
        }).catch(console.error)
    }
    return true
}
