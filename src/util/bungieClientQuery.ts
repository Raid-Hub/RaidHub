import {
    QueryObserverOptions,
    RefetchOptions,
    RefetchQueryFilters,
    useQuery as useQueryT
} from "@tanstack/react-query"
import BungieClient from "./bungieClient"
import { v4 } from "uuid"

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
            return useQueryT<TData, TError>({
                ...options,
                queryKey: [queryId, client.getToken(), params],
                queryFn: () => queryFn(params)
            })
        },

        refetchQueries<TPageData = unknown>(
            filters?: RefetchQueryFilters<TPageData>,
            options?: RefetchOptions
        ) {
            return client.queryClient.refetchQueries({ ...filters, queryKey: [queryId] }, options)
        }
    }
}
