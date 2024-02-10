"use client"

import { Session } from "next-auth"
import { SessionProvider, signOut } from "next-auth/react"
import { ReactNode, useEffect, useState } from "react"
import { useBungieClient } from "./BungieTokenManager"

export function ClientSessionManager(props: {
    children: ReactNode
    serverSession: Session | null
}) {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)
    const [failedTokenRequests, setFailedTokenRequests] = useState(0)
    const bungieClient = useBungieClient()

    if (failedTokenRequests >= 3) {
        setFailedTokenRequests(0)
        signOut()
        bungieClient.clearToken()
    }

    // every time the session is updated, we should set the refresh interval to the remaining time on the token
    useEffect(() => {
        if (props.serverSession === null) {
            setSessionRefetchInterval(0)
        } else if (props.serverSession.error === "BungieAPIOffline") {
            console.error(props.serverSession.error)
            setSessionRefetchInterval(120)
        } else if (props.serverSession.error === "AccessTokenError") {
            console.error(props.serverSession.error)
            setFailedTokenRequests(prev => prev + 1)
            setSessionRefetchInterval(10)
        } else if (props.serverSession.error === "ExpiredRefreshTokenError") {
            setSessionRefetchInterval(0)
            signOut()
            bungieClient.clearToken()
        } else if (props.serverSession.bungieAccessToken) {
            setFailedTokenRequests(0)
            bungieClient.setToken(props.serverSession.bungieAccessToken.value)

            const timeRemaining =
                new Date(props.serverSession.bungieAccessToken.expires).getTime() - Date.now()
            setSessionRefetchInterval(timeRemaining > 0 ? Math.ceil(timeRemaining / 1000) : 0)
        }
    }, [props.serverSession])

    return (
        <SessionProvider
            refetchInterval={sessionRefetchInterval}
            refetchOnWindowFocus={false}
            session={props.serverSession}>
            {props.children}
        </SessionProvider>
    )
}
