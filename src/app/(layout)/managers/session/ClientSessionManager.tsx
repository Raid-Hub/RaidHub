"use client"

import { type Session } from "next-auth"
import { SessionProvider, signOut } from "next-auth/react"
import { useEffect, useState, type ReactNode } from "react"
import { useSession } from "~/hooks/app/useSession"
import { useBungieClient } from "./BungieClientProvider"

export const ClientSessionManager = (props: {
    children: ReactNode
    serverSession: Session | null
}) => {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)
    return (
        <SessionProvider
            refetchInterval={sessionRefetchInterval}
            refetchOnWindowFocus={false}
            session={props.serverSession}>
            <TokenManager setNextRefetch={setSessionRefetchInterval} />
            {props.children}
        </SessionProvider>
    )
}

const TokenManager = ({ setNextRefetch }: { setNextRefetch: (seconds: number) => void }) => {
    const [failedTokenRequests, setFailedTokenRequests] = useState(0)
    const bungieClient = useBungieClient()
    const session = useSession<false>()

    if (failedTokenRequests >= 3) {
        setFailedTokenRequests(0)
        void signOut()
        bungieClient.clearToken()
    }

    // every time the session is updated, we should set the refresh interval to the remaining time on the token
    useEffect(() => {
        if (session.status === "unauthenticated") {
            bungieClient.clearToken()
            setNextRefetch(0)
        } else if (!session.data) {
            // loading, do nothing
        } else if (session.data.error === "BungieAPIOffline") {
            console.error(new Error(session.data.error))
            setNextRefetch(120)
        } else if (session.data.error === "AccessTokenError") {
            console.error(new Error(session.data.error))
            setFailedTokenRequests(prev => prev + 1)
            setNextRefetch(10)
        } else if (session.data.error === "ExpiredRefreshTokenError") {
            console.error(new Error(session.data.error))
            bungieClient.clearToken()
            void signOut()
            setNextRefetch(0)
        } else if (session.data.bungieAccessToken) {
            setFailedTokenRequests(0)
            const expires = new Date(session.data.bungieAccessToken.expires)
            bungieClient.setToken({
                value: session.data.bungieAccessToken.value,
                expires: expires
            })

            const timeRemaining = expires.getTime() - Date.now()
            setNextRefetch(timeRemaining > 0 ? Math.ceil(timeRemaining / 1000) : 1)
        }
    }, [bungieClient, session, setNextRefetch])

    return null
}
