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
            void signOut()
        } else if (sessionData?.token) {
            const timeRemaining = sessionData.token.expires - Date.now()
            console.log("timeRemaining", timeRemaining)
            setRefetchInterval(timeRemaining > 0 ? timeRemaining : 0)
        }
    }, [sessionData])

    useEffect(() => {
        if (status == "unauthenticated") {
            setRefetchInterval(0)
        }
    }, [status])

    return null
}

export default TokenManager
