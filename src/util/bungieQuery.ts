import {
    QueryObserverOptions,
    RefetchOptions,
    RefetchQueryFilters,
    UseQueryOptions,
    useQueries,
    useQuery,
    FetchQueryOptions,
    QueryClient,
    Query
} from "@tanstack/react-query"
import { UseQueryOptionsForUseQueries } from "@trpc/react-query/dist/internals/useQueries"

export type QueryFn<TParams, TData> = (params: TParams) => Promise<TData>

export default function BungieQuery<TParams, TData>(
    client: { queryClient: QueryClient },
    queryFn: QueryFn<TParams, TData>,
    queryId: string
) {
    return {
        queryKey(params: TParams) {
            return ["bungie", queryId, params] as const
        },

        useQuery<TError = unknown>(
            params: TParams,
            options?: Omit<
                QueryObserverOptions<TData, TError, TData>,
                "queryKey" | "queryFn" | "queryHash" | "queryKeyHashFn"
            >
        ) {
            return useQuery<TData, TError>({
                ...options,
                queryKey: this.queryKey(params),
                queryFn: () => queryFn(params)
            })
        },

        useQueries<
            T extends Omit<
                QueryObserverOptions<TData, unknown, TData>,
                "queryKey" | "queryFn" | "queryHash" | "queryKeyHashFn"
            >
        >(queries: TParams[], options?: T, context?: UseQueryOptions["context"]) {
            return useQueries<UseQueryOptionsForUseQueries<TData, unknown, TData>[]>({
                context,
                queries: queries.map(params => ({
                    ...options,
                    queryKey: this.queryKey(params),
                    queryFn: () => queryFn(params)
                }))
            })
        },

        getQueryData(params: TParams) {
            return client.queryClient.getQueryData(this.queryKey(params)) as TData | undefined
        },

        refetchQueries<TPageData = unknown>(
            predicate?: RefetchQueryFilters<TPageData>["predicate"],
            options?: RefetchOptions
        ) {
            return client.queryClient.refetchQueries(
                {
                    predicate: (query: Query) =>
                        query.queryKey.includes(queryId) && (predicate?.(query) ?? true)
                },
                options
            )
        },

        prefetchQuery(params: TParams, options?: FetchQueryOptions<TData, unknown, TData>) {
            return client.queryClient.prefetchQuery(
                this.queryKey(params),
                () => queryFn(params),
                options
            )
        }
    }
}
