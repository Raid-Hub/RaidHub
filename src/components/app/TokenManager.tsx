import { useQueryClient } from "@tanstack/react-query"
import { signOut, useSession } from "next-auth/react"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import BungieClient from "~/services/bungie/client"

const BungieClientContext = createContext<BungieClient | null>(null)

type TokenManagerProps = {
    setRefetchInterval(val: number): void
    children: ReactNode
}

const TokenManager = ({ setRefetchInterval, children }: TokenManagerProps) => {
    const { data: sessionData, status } = useSession()
    const [accessToken, setAccessToken] = useState<string>("")
    const [failedTokenRequests, setFailedTokenRequests] = useState(0)

    const queryClient = useQueryClient()
    const [bungie] = useState(new BungieClient(queryClient))

    if (failedTokenRequests > 3) {
        signOut()
    }

    // every time the session is updated, we should set the refresh interval to the remaining time on the token
    useEffect(() => {
        if (sessionData?.error == "BungieAPIOffline") {
            setRefetchInterval(120)
        } else if (sessionData?.error == "AccessTokenError") {
            console.error(sessionData.error)
            setRefetchInterval(10)
            setFailedTokenRequests(prev => prev + 1)
        } else if (sessionData?.error == "ExpiredRefreshTokenError") {
            setRefetchInterval(0)
            signOut()
        } else if (status == "unauthenticated") {
            setRefetchInterval(0)
        } else if (
            sessionData?.user.bungieAccessToken?.value &&
            sessionData.user.bungieAccessToken.expires
        ) {
            setAccessToken(sessionData.user.bungieAccessToken.value)
            const timeRemaining = sessionData.user.bungieAccessToken.expires - Date.now()
            setRefetchInterval(timeRemaining >= 0 ? Math.ceil((timeRemaining + 1) / 1000) : 0)
        }
    }, [sessionData, status, setRefetchInterval])

    useEffect(() => {
        if (accessToken) {
            bungie.setToken(accessToken)
        } else {
            bungie.clearToken()
        }
    }, [bungie, accessToken])

    return <BungieClientContext.Provider value={bungie}>{children}</BungieClientContext.Provider>
}

export const useBungieClient = () => {
    const client = useContext(BungieClientContext)
    if (client === null) throw Error("Cannot use BungieClient outside a child of TokenManager")
    return client
}

export default TokenManager
