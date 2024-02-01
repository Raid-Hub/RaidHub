import { useQueryClient } from "@tanstack/react-query"
import { signOut, useSession } from "next-auth/react"
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react"
import BungieClient from "~/util/bungieClient"

const BungieClientContext = createContext<BungieClient | null>(null)

type TokenManagerProps = {
    setRefetchInterval(val: number): void
    children: ReactNode
}

const TokenManager = ({ setRefetchInterval, children }: TokenManagerProps) => {
    const { data: sessionData, status } = useSession()
    const [failedTokenRequests, setFailedTokenRequests] = useState(0)

    const queryClient = useQueryClient()
    const bungie = useRef(new BungieClient(queryClient))

    if (failedTokenRequests >= 3) {
        setFailedTokenRequests(0)
        signOut()
        bungie.current.clearToken()
    }

    // every time the session is updated, we should set the refresh interval to the remaining time on the token
    useEffect(() => {
        if (status == "unauthenticated") {
            setRefetchInterval(0)
        } else if (sessionData?.error == "BungieAPIOffline") {
            console.error(sessionData.error)
            setRefetchInterval(120)
        } else if (sessionData?.error == "AccessTokenError") {
            console.error(sessionData.error)
            setFailedTokenRequests(prev => prev + 1)
            setRefetchInterval(10)
        } else if (sessionData?.error == "ExpiredRefreshTokenError") {
            setRefetchInterval(0)
            signOut()
            bungie.current.clearToken()
        } else if (sessionData?.bungieAccessToken) {
            setFailedTokenRequests(0)
            bungie.current.setToken(sessionData.bungieAccessToken.value)
            const timeRemaining =
                // bungieAccessToken.expires is an ISO string, not a date
                new Date(sessionData.bungieAccessToken.expires).getTime() - Date.now()
            setRefetchInterval(timeRemaining > 0 ? Math.ceil(timeRemaining / 1000) : 0)
        }
    }, [sessionData, status, setRefetchInterval])

    return (
        <BungieClientContext.Provider value={bungie.current}>
            {children}
        </BungieClientContext.Provider>
    )
}

export const useBungieClient = () => {
    const client = useContext(BungieClientContext)
    if (client === null) throw Error("Cannot use BungieClient outside a child of TokenManager")
    return client
}

export default TokenManager
