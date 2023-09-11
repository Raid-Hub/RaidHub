import {
    QueriesOptions,
    QueryKey,
    QueryObserverOptions,
    RefetchOptions,
    RefetchQueryFilters,
    UseQueryOptions,
    UseQueryResult,
    useQueries,
    useQuery
} from "@tanstack/react-query"
import BungieClient from "./bungieClient"
import { v4 } from "uuid"
import { UseQueryOptionsForUseQueries } from "@trpc/react-query/dist/internals/useQueries"

export type QueryFn<TParams, TData> = (params: TParams) => Promise<TData>

export default function BungieQuery<TParams, TData>(
    client: BungieClient,
    queryFn: QueryFn<TParams, TData>
) {
    const queryId = v4()
    return {
        useQuery<TError = unknown>(
            params: TParams,
            options?: Omit<
                QueryObserverOptions<TData, TError, TData>,
                "queryKey" | "queryFn" | "queryHash" | "queryKeyHashFn"
            >
        ) {
            return useQuery<TData, TError>({
                ...options,
                queryKey: [queryId, client.getToken(), params],
                queryFn: () => queryFn(params)
            })
        },

        useQueries<
            T extends Omit<
                QueryObserverOptions<TData, unknown, TData>,
                "queryKey" | "queryFn" | "queryHash" | "queryKeyHashFn"
            >[]
        >(queries: TParams[], options?: T, context?: UseQueryOptions["context"]) {
            return useQueries<UseQueryOptionsForUseQueries<TData, unknown, TData>[]>({
                context,
                queries: queries.map(params => ({
                    ...options,
                    queryKey: [queryId, client.getToken(), params],
                    queryFn: () => queryFn(params)
                }))
            })
        },

        getQueryData(params: TParams) {
            return client.queryClient.getQueryData([queryId, client.getToken(), params]) as
                | TData
                | undefined
        },

        refetchQueries<TPageData = unknown>(
            filters?: RefetchQueryFilters<TPageData>,
            options?: RefetchOptions
        ) {
            return client.queryClient.refetchQueries({ ...filters, queryKey: [queryId] }, options)
        }
    }
}
