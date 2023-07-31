import { CallbacksOptions } from "next-auth/core/types"
import { AdapterUser } from "next-auth/adapters"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"

export const signInCallback: CallbacksOptions["signIn"] = async ({ user, account, profile }) => {
    const canSignIn = !!(user as AdapterUser).destiny_membership_id && !!account
    if (canSignIn) {
        if (account.provider === "bungie") {
            const now = Date.now()
            await updateBungieAccessTokens(user.id, {
                access: {
                    value: account.access_token!,
                    expires: now + 3_595_000,
                    type: "access",
                    created: now
                },
                refresh: {
                    value: account.access_token!,
                    expires: now + 7_775_995_000,
                    type: "refresh",
                    created: now
                }
            })
        }
    }
    return canSignIn
}
