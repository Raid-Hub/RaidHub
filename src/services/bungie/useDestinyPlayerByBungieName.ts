import { useQuery } from "@tanstack/react-query"
import { searchDestinyPlayerByBungieName } from "bungie-net-core/endpoints/Destiny2"
import { useBungieClient } from "~/app/managers/BungieTokenManager"
import { isPrimaryCrossSave } from "~/util/destiny/crossSave"

export const useDestinyPlayerByBungieName = (
    params: {
        displayName: string
        displayNameCode: number
    },
    opts?: {
        enabled?: boolean
    }
) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "player by bungie name", params] as const,
        queryFn: ({ queryKey }) =>
            searchDestinyPlayerByBungieName(
                bungieClient,
                {
                    membershipType: -1
                },
                queryKey[2]
            ).then(res => res.Response.filter(p => isPrimaryCrossSave(p))),
        ...opts
    })
}
