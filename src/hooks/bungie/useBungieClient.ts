import { useSession } from "next-auth/react"
import { useEffect } from "react"
import BungieClient from "../../services/bungie/client"

const client = new BungieClient()

export function useBungieClient(): BungieClient {
    const { data } = useSession()

    useEffect(() => {
        if (data?.token) {
            client.setToken(data.token.value)
        } else {
            client.clearToken()
        }
    }, [data?.token])

    return client
}
