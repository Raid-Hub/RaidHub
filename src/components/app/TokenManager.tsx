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
        if (sessionData?.error == "BungieAPIOffline") {
            setRefetchInterval(120)
        } else if (sessionData?.error == "AccessTokenError") {
            console.error(sessionData.error)
            setRefetchInterval(5)
        } else if (sessionData?.error == "ExpiredRefreshTokenError") {
            setRefetchInterval(0)
            signOut()
        } else if (status == "unauthenticated") {
            setRefetchInterval(0)
        } else if (
            sessionData?.user.bungieAccessToken?.value &&
            sessionData.user.bungieAccessToken.expires
        ) {
            client.setToken(sessionData.user.bungieAccessToken.value)
            const timeRemaining = sessionData.user.bungieAccessToken.expires - Date.now()
            setRefetchInterval(timeRemaining >= 0 ? Math.ceil((timeRemaining + 1) / 1000) : 0)
        }
    }, [sessionData, status, setRefetchInterval])

    return <BungieClientContext.Provider value={client}>{children}</BungieClientContext.Provider>
}

export const useBungieClient = () => useContext(BungieClientContext)

export default TokenManager
