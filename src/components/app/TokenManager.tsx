import { signOut, useSession } from "next-auth/react"
import { ReactNode, createContext, useContext, useEffect } from "react"
import BungieClient from "../../services/bungie/client"

const client = new BungieClient()
const BungieClientContext = createContext<BungieClient>(client)

type TokenManagerProps = {
    setRefetchInterval(val: number): void
    children: ReactNode
}

const TokenManager = ({ setRefetchInterval, children }: TokenManagerProps) => {
    const { data: sessionData, status } = useSession()

    // every time the session is updated, we should set the refresh interval to the remaining time on the token
    useEffect(() => {
        client.clearToken()
        if (sessionData?.error == "RefreshAccessTokenError") {
            setRefetchInterval(0)
        } else if (sessionData?.error == "ExpiredRefreshTokenError") {
            console.error(sessionData)
            setRefetchInterval(0)
            signOut()
        } else if (status == "unauthenticated") {
            setRefetchInterval(0)
        } else if (sessionData?.token) {
            client.setToken(sessionData.token.value)
            const timeRemaining = sessionData.token.expires - Date.now()
            setRefetchInterval(timeRemaining > 0 ? timeRemaining / 1000 : 0)
        }
    }, [sessionData, status, setRefetchInterval])

    return <BungieClientContext.Provider value={client}>{children}</BungieClientContext.Provider>
}

export function useBungieClient(): BungieClient {
    return useContext(BungieClientContext)
}

export default TokenManager
