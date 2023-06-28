import { useSession } from "next-auth/react"

const TokenManager = () => {
    const { data, update } = useSession()
    if (data?.error == "ExpiredRefreshTokenError") {
        update()
    } else if (data?.error == "RefreshAccessTokenError") {
        // todo
        console.error(data)
    }
    return <></>
}

export default TokenManager
