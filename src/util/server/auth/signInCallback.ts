import { CallbacksOptions } from "next-auth/core/types"
import { AdapterUser } from "next-auth/adapters"

/** Determines if an account can be used to sign in with */
export const signInCallback: CallbacksOptions["signIn"] = async ({ user, account, profile }) => {
    const adapterUser = user as AdapterUser
    /** ensure there is a valid destiny_membership_id on the user (either from this account
     * being bungie, or a previous bungie login) */
    return !!adapterUser.destiny_membership_id
}
