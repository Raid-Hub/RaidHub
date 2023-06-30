import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import BungieNetClient from "../../services/bungie/bungieClient"

export function useBungieClient(): BungieNetClient {
    const [client] = useState(new BungieNetClient())
    const { data } = useSession()

    useEffect(() => {
        if (data?.token) {
            client.login(data.token.value)
        } else {
            client.logout()
        }
    }, [data?.token])

    return client
}
