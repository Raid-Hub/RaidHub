import { QueryClient, dehydrate } from "@tanstack/react-query"
import { GetStaticPropsResult } from "next"
import { getLeaderboard, leaderbordQueryKey } from "~/services/raidhub/getLeaderboard"
import { ListedRaid } from "~/types/raids"

export function createServerQueryClient() {
    return new QueryClient()
}

export async function prefetchLeaderboard<R extends ListedRaid>(
    raid: R,
    params: string[],
    pages: number
): Promise<
    GetStaticPropsResult<{
        raid: R
        dehydratedState: unknown
    }>
> {
    const queryClient = createServerQueryClient()

    // we prefetch the first page at build time
    const staleTime = 24 * 60 * 60 * 1000 // 24 hours
    await Promise.all(
        new Array(pages).fill(undefined).map((_, idx) =>
            queryClient.prefetchQuery(
                leaderbordQueryKey(raid, params, idx),
                () => getLeaderboard(raid, params, idx),
                {
                    staleTime
                }
            )
        )
    )

    return {
        props: {
            raid,
            dehydratedState: dehydrate(queryClient)
        },
        revalidate: staleTime / 1000 // revalidate takes seconds
    }
}
