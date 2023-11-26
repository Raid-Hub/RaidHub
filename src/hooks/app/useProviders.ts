import { Collection } from "@discordjs/collection"
import { useQuery } from "@tanstack/react-query"
import { Provider } from "next-auth/providers"

export const useProviders = () => {
    const { data, ...query } = useQuery({
        queryKey: ["providers"],
        queryFn: () =>
            fetch("/api/auth/providers")
                .then(res => {
                    const data = res.json()
                    if (res.ok) {
                        return data
                    } else {
                        throw data
                    }
                })
                .then(
                    providers => new Collection<string, Provider>(Object.entries(providers ?? {}))
                )
    })
    return {
        providers: data,
        ...query
    }
}
