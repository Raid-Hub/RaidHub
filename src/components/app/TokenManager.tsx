import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"

type TokenManagerProps = {
    setRefetchInterval(val: number): void
}

const TokenManager = ({ setRefetchInterval }: TokenManagerProps) => {
    const { data: sessionData, status } = useSession()

    // every time the session is updated, we should set the refresh interval to the remaining time on the token
    useEffect(() => {
        if (sessionData?.error == "RefreshAccessTokenError") {
            setRefetchInterval(0)
        } else if (sessionData?.error == "ExpiredRefreshTokenError") {
            console.error(sessionData)
            setRefetchInterval(0)
            signOut()
        } else if (sessionData?.token) {
            const timeRemaining = sessionData.token.expires - Date.now()
            setRefetchInterval(timeRemaining > 0 ? timeRemaining / 1000 : 0)
        }
    }, [sessionData, setRefetchInterval])

    useEffect(() => {
        if (status == "unauthenticated") {
            setRefetchInterval(0)
        }
    }, [status, setRefetchInterval])

    return null
}

export default TokenManager
