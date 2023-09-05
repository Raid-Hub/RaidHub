import { signOut, useSession } from "next-auth/react"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import BungieClient from "~/services/bungie/client"

const BungieAccessTokenContext = createContext<string | null>(null)

type TokenManagerProps = {
    setRefetchInterval(val: number): void
    children: ReactNode
}

const TokenManager = ({ setRefetchInterval, children }: TokenManagerProps) => {
    const { data: sessionData, status } = useSession()
    const [accessToken, setAccessToken] = useState<string>("")
    const [failedTokenRequests, setFailedTokenRequests] = useState(0)

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
    return (
        <BungieAccessTokenContext.Provider value={accessToken}>
            {children}
        </BungieAccessTokenContext.Provider>
    )
}

const client = new BungieClient()
export const useBungieClient = () => {
    const accessToken = useContext(BungieAccessTokenContext)
    if (accessToken === null) throw Error("Cannot use BungieClient outside a child of TokenManager")

    if (accessToken) {
        client.setToken(accessToken)
    } else {
        client.clearToken()
    }
    return client
}

export default TokenManager
