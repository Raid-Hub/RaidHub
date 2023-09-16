import { Collection } from "@discordjs/collection"
import { useQuery } from "@tanstack/react-query"
import { getProviders } from "next-auth/react"

export const useProviders = () => {
    const { data, ...query } = useQuery({
        queryKey: ["providers"],
        queryFn: () =>
            getProviders().then(providers => new Collection(Object.entries(providers ?? {})))
    })
    return {
        providers: data,
        ...query
    }
}
