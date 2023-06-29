import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import BungieNetClient from "../../util/bungieClient"

export function useBungieClient(): BungieNetClient {
    const [client] = useState(new BungieNetClient())
    const { data } = useSession()

    useEffect(() => {
        if (data?.access_token) {
            client.login(data.access_token)
        } else {
            client.logout()
        }
    }, [data?.access_token])

    return client
}
