"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode, useState } from "react"
import { BungieTokenManager } from "./BungieTokenManager"

export function SessionManager(props: { children: ReactNode }) {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)

    return (
        <SessionProvider refetchInterval={sessionRefetchInterval} refetchOnWindowFocus={false}>
            <BungieTokenManager setRefetchInterval={setSessionRefetchInterval}>
                {props.children}
            </BungieTokenManager>
        </SessionProvider>
    )
}
