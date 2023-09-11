import { QueryClient, dehydrate } from "@tanstack/react-query"
import { Leaderboard, getLeaderboard, leaderbordQueryKey } from "~/services/raidhub/getLeaderboard"
import { ListedRaid } from "~/types/raids"

export function createServerQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 0
            }
        }
    })
}

export async function prefetchLeaderboard<R extends ListedRaid>(
    raid: R,
    board: Leaderboard,
    params: string[],
    pages: number
) {
    const queryClient = createServerQueryClient()

    // we prefetch the first page at build time
    const staleTime = 24 * 60 * 60 * 1000 // 24 hours
    await Promise.all(
        new Array(pages).fill(undefined).map((_, idx) =>
            queryClient.prefetchQuery(
                leaderbordQueryKey(raid, board, params, idx),
                () => getLeaderboard(raid, board, params, idx),
                {
                    staleTime
                }
            )
        )
    )

    return {
        staleTime,
        dehydratedState: dehydrate(queryClient)
    }
}
