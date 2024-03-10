import "server-only"

import type { Profile } from "@prisma/client"
import { type Account } from "next-auth"
import { updateBungieAccessTokens } from "./updateBungieAccessTokens"

export const signInCallback = async ({
    account,
    user
}: {
    account: Account
    user: Profile & { fresh?: true }
}) => {
    // Users from the bungie callback will not need to refresh their tokens
    if (account?.provider === "bungie" && !user.fresh) {
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
