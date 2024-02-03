"use client"

import { signOut, useSession } from "next-auth/react"
import {
    MutableRefObject,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react"

const BungieClientContext = createContext<MutableRefObject<string | null> | undefined>(undefined)
export const BungieTokenManager = (props: {
    setRefetchInterval(val: number): void
    children: ReactNode
}) => {
    const { data: sessionData, status } = useSession()
    const [failedTokenRequests, setFailedTokenRequests] = useState(0)
    const bungieAccessToken = useRef<string | null>(null)

    if (failedTokenRequests >= 3) {
        setFailedTokenRequests(0)
        signOut()
        bungieAccessToken.current = null
    }

    // every time the session is updated, we should set the refresh interval to the remaining time on the token
    useEffect(() => {
        if (status == "unauthenticated") {
            props.setRefetchInterval(0)
        } else if (sessionData?.error == "BungieAPIOffline") {
            console.error(sessionData.error)
            props.setRefetchInterval(120)
        } else if (sessionData?.error == "AccessTokenError") {
            console.error(sessionData.error)
            setFailedTokenRequests(prev => prev + 1)
            props.setRefetchInterval(10)
        } else if (sessionData?.error == "ExpiredRefreshTokenError") {
            props.setRefetchInterval(0)
            signOut()
            bungieAccessToken.current = null
        } else if (sessionData?.bungieAccessToken) {
            setFailedTokenRequests(0)
            bungieAccessToken.current = sessionData.bungieAccessToken.value
            const timeRemaining =
                // bungieAccessToken.expires is an ISO string, not a date
                new Date(sessionData.bungieAccessToken.expires).getTime() - Date.now()
            props.setRefetchInterval(timeRemaining > 0 ? Math.ceil(timeRemaining / 1000) : 0)
        }
    }, [sessionData, status, props.setRefetchInterval])

    return (
        <BungieClientContext.Provider value={bungieAccessToken}>
            {props.children}
        </BungieClientContext.Provider>
    )
}

export const useBungieAccessToken = () => {
    const tokenRef = useContext(BungieClientContext)
    if (!tokenRef)
        throw Error("Cannot use useBungieAccessToken outside a child of BungieTokenManager")
    return tokenRef.current
}
