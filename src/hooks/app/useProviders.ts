import { Collection } from "@discordjs/collection"
import { useQuery } from "@tanstack/react-query"
import { type Provider } from "next-auth/providers"

export const useProviders = () => {
    const { data, ...query } = useQuery({
        queryKey: ["providers"],
        queryFn: () =>
            fetch("/api/auth/providers").then(async (res): Promise<Record<string, Provider>> => {
                const data = res.json()
                if (res.ok) {
                    return data
                } else {
                    throw await data
                }
            }),
        select: data => new Collection(Object.entries(data))
    })
    return {
        providers: data,
        ...query
    }
}
