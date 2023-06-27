import { useSession } from "next-auth/react"
import { useState } from "react"
import BungieNetClient from "../../util/bungieClient"

export function useBungieClient(): BungieNetClient {
    const [client] = useState(new BungieNetClient())
    const { data } = useSession()

    console.log(data?.client.getActivityHistory, client.getActivityHistory)
    return data?.client ?? client
}
