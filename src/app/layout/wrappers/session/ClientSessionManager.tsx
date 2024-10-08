"use client"

import { type Session } from "next-auth"
import { SessionProvider, signOut } from "next-auth/react"
import { useEffect, useState, type ReactNode } from "react"
import { useSession } from "~/hooks/app/useSession"
import { useBungieClient } from "./BungieClientProvider"

/**
 * When we force-static on a page, the session will be null every time.
 * In order to prevent the user from appearing to be logged out,
 * we need force the session to be fetched client-side by setting this value to undefined
 *
 * For some reason, NextAuth;s broadcast channel causes the session to be fetched twice client-side
 * This useEffect is a workaround to prevent that from happening
 * */

export const ClientSessionManager = (props: {
    children: ReactNode
    serverSession: Session | null | undefined
}) => {
    const [sessionRefetchInterval, setSessionRefetchInterval] = useState(0)

    return (
        <SessionProvider
            refetchInterval={sessionRefetchInterval / 1000}
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
            session={props.serverSession}>
            <TokenManager setNextRefetch={setSessionRefetchInterval} />
            {props.children}
        </SessionProvider>
    )
}

const TokenManager = ({ setNextRefetch }: { setNextRefetch: (milliseconds: number) => void }) => {
    const [failedTokenRequests, setFailedTokenRequests] = useState(0)
    const bungieClient = useBungieClient()
    const session = useSession<false>()

    if (failedTokenRequests >= 4) {
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
        } else if (session.data.errors.includes("BungieAPIOffline")) {
            setNextRefetch(120_000)
        } else if (session.data.errors.includes("AccessTokenError")) {
            setNextRefetch(10_000)
            setFailedTokenRequests(prev => prev + 1)
        } else if (session.data.errors.includes("ExpiredRefreshTokenError")) {
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

            const timeRemainingOnBungie = expires.getTime() - Date.now()
            if (session.data.raidHubAccessToken?.expires) {
                const timeRemainingOnRaidHubToken =
                    new Date(session.data.raidHubAccessToken.expires).getTime() - Date.now()
                setNextRefetch(
                    Math.max(Math.min(timeRemainingOnBungie, timeRemainingOnRaidHubToken), 1000)
                )
            } else {
                setNextRefetch(Math.max(timeRemainingOnBungie, 1000))
            }

            return bungieClient.onUnauthorized(session.update)
        }
    }, [bungieClient, session, setNextRefetch])

    return null
}
