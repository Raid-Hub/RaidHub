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
    if (
        account?.provider === "bungie" &&
        // @ts-expect-error Types are wrong
        user.createdAt
    ) {
        await updateBungieAccessTokens({
            userId: account.providerAccountId,
            access: {
                value: account.access_token!,
                expires: new Date(account.expires_at! * 1000)
            },
            refresh: {
                value: account.refresh_token!,
                expires: new Date(Date.now() + (account.refresh_expires_in as number) * 1000)
            }
        })
    }
    return true
}
