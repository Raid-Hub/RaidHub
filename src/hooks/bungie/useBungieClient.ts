import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import BungieNetClient from "../../util/bungieClient"

export function useBungieClient(): BungieNetClient {
    const [client, setClient] = useState(new BungieNetClient())
    const { data } = useSession()

    // useEffect(() => {
    //     if (data?.client) {
    //         setClient(data.client)
    //     }
    // }, [data?.client])

    return client
}
