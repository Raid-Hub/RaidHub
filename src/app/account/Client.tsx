"use client"

import { Collection } from "@discordjs/collection"
import { ForceClientSideBungieSignIn } from "~/components/ForceClientSideBungieSignIn"
import Account from "~/components/__deprecated__/account/Account"

export const Client = ({
    providers
}: {
    providers: {
        id: string
        name: string
        type: string
    }[]
}) => (
    <ForceClientSideBungieSignIn
        whenSignedIn={session => (
            <>
                <h1>Welcome, {session.user.name}</h1>
                <Account
                    session={session}
                    providers={new Collection(providers.map(p => [p.id, p]))}
                />
            </>
        )}
    />
)
