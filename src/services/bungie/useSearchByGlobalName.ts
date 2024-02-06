import { useQuery } from "@tanstack/react-query"
import { searchByGlobalNamePost } from "bungie-net-core/endpoints/User"
import { UserSearchResponseDetail } from "bungie-net-core/models"
import { useBungieClient } from "~/app/managers/BungieTokenManager"

export const useSearchByGlobalName = (
    params: { displayNamePrefix: string },
    opts?: {
        enabled?: boolean
    }
) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "player by global name", params] as const,
        queryFn: ({ queryKey }) =>
            searchByGlobalNamePost(
                bungieClient,
                {
                    page: 0
                },
                queryKey[2]
            )
                .then(res =>
                    res.Response.searchResults.filter(r => r.destinyMemberships.length > 0)
                )
                .catch((error): UserSearchResponseDetail[] => {
                    if (
                        /**PlatformErrorCodes.UserCannotResolveCentralAccount*/
                        error.ErrorCode === 217
                    ) {
                        return []
                    } else {
                        throw error
                    }
                }),
        ...opts
    })
}
