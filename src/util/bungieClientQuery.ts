import {
    QueryObserverOptions,
    RefetchOptions,
    RefetchQueryFilters,
    useQuery as useQueryT
} from "@tanstack/react-query"
import BungieClient from "./bungieClient"
import { v4 } from "uuid"

export type QueryFn<TParams, TData> = (params: TParams) => Promise<TData>

export default class BungieQuery<TParams, TData> {
    private client: BungieClient
    private queryFn: QueryFn<TParams, TData>
    private queryId = v4()

    constructor(client: BungieClient, queryFn: QueryFn<TParams, TData>) {
        this.client = client
        this.queryFn = queryFn
    }

    useQuery<TError = unknown>(
        params: TParams,
        options?: Omit<
            QueryObserverOptions<TData, TError, TData>,
            "queryKey" | "queryFn" | "queryHash" | "queryKeyHashFn"
        >
    ) {
        return useQueryT<TData, TError>({
            ...options,
            queryKey: [this.queryId, this.client.getToken(), params],
            queryFn: () => this.queryFn(params)
        })
    }

    refetchQueries<TPageData = unknown>(
        filters?: RefetchQueryFilters<TPageData>,
        options?: RefetchOptions
    ) {
        return this.client.queryClient.refetchQueries(
            { ...filters, queryKey: [this.queryId] },
            options
        )
    }
}
