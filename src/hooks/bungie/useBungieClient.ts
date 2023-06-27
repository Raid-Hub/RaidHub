import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import BungieNetClient from "../../util/bungieClient"

export function useBungieClient(): BungieNetClient {
    const [client] = useState(new BungieNetClient())
    const { data } = useSession()

    useEffect(() => {
        if (data?.token) {
            client.login(data.token)
        } else {
            client.logout()
        }
    }, [data])

    console.log(data)

    return client
}
