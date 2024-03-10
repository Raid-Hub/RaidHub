"use client"

import { Collection } from "@discordjs/collection"
import { type Provider } from "next-auth/providers"
import { ForceClientSideBungieSignIn } from "~/components/ForceClientSideBungieSignIn"
import Account from "~/components/__deprecated__/account/Account"

export const Client = ({ providers }: { providers: Record<string, Provider> }) => (
    <ForceClientSideBungieSignIn
        whenSignedIn={session => (
            <>
                <h1>Welcome, {session.user.name}</h1>
                <Account
                    session={session}
                    providers={new Collection(Object.entries(providers ?? {}))}
                />
            </>
        )}
    />
)
