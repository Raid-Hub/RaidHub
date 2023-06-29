import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"

type TokenManagerProps = {
    setRefetchInterval(val: number): void
}

const TokenManager = ({ setRefetchInterval }: TokenManagerProps) => {
    const { data: sessionData, status } = useSession()

    // every time the session is updated, we should set the refresh interval to the remaining time on the token
    // useEffect(() => {
    //     if (sessionData?.error == "RefreshAccessTokenError") {
    //         setRefetchInterval(0)
    //     } else if (sessionData?.error == "ExpiredRefreshTokenError") {
    //         console.error(sessionData)
    //         void signOut()
    //     } else if (sessionData) {
    //         const timeRemaining = Math.round((sessionData.token_expiry - Date.now()) / 1000)
    //         setRefetchInterval(timeRemaining > 0 ? timeRemaining : 0)
    //     }

    //     console.log("useEffectTokenManager", sessionData)
    // }, [sessionData])

    return null
}

export default TokenManager
