import { Collection } from "@discordjs/collection"
import { ClientSafeProvider, getProviders } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"

export const useProviders = () => {
    const [providers, setProviders] = useState<Collection<string, ClientSafeProvider>>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        const data = await getProviders()
        setProviders(new Collection(Object.entries(data ?? {})))
        setIsLoading(false)
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { providers, isLoading }
}
