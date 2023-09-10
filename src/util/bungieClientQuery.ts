import {
    QueryObserverOptions,
    RefetchOptions,
    RefetchQueryFilters,
    UseQueryOptions,
    UseQueryResult,
    useQuery as tanstackUseQuery
} from "@tanstack/react-query"
import BungieClient from "./bungieClient"
import { v4 } from "uuid"

type UseBungieQuery<TParams, TData, TError = unknown> = (
    params: TParams,
    options?: Omit<
        QueryObserverOptions<TData, TError, TData>,
        "queryKey" | "queryFn" | "queryHash" | "queryKeyHashFn"
    >
) => UseQueryResult<TData, TError>

export type QueryFn<TParams, TData> = (params: TParams) => Promise<TData>

export default class BungieQuery<TParams, TData> {
    private client: BungieClient
    private queryFn: QueryFn<TParams, TData>
    private queryId = v4()

    constructor(client: BungieClient, queryFn: QueryFn<TParams, TData>) {
        this.client = client
        this.queryFn = queryFn
    }

    useQuery: UseBungieQuery<TParams, TData> = (params, options) => {
        const opts: UseQueryOptions<TData, unknown, TData> = {
            ...options,
            queryFn: () => this.queryFn(params),
            queryKey: [this.queryId, this.client.getToken(), params]
        }
        return tanstackUseQuery(opts)
    }

    refetchQueries<TPageData = unknown>(
        filters?: RefetchQueryFilters<TPageData>,
        options?: RefetchOptions
    ) {
        this.client.queryClient.refetchQueries({ ...filters, queryKey: [this.queryId] }, options)
    }
}
