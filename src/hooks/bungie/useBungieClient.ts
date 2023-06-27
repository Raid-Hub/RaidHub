import { useSession } from "next-auth/react"
import { useEffect } from "react"
import BungieNetClient from "../../util/bungieClient"

const client = new BungieNetClient()

export function useBungieClient(): BungieNetClient {
    const { data } = useSession()

    useEffect(() => {
        if (data?.token) {
            client.login(data.token)
        } else {
            client.logout()
        }
    }, [data?.token])

    console.log(client)
    return client
}
