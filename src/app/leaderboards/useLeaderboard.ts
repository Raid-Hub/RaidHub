import {
    useQuery,
    type QueryFunction,
    type QueryKey,
    type UseQueryResult
} from "@tanstack/react-query"
import { type LeaderboardEntry } from "./LeaderboardEntries"

type Entries<T extends "player" | "team"> = Extract<
    LeaderboardEntry,
    {
        type: T
    }
>[]

export type UseLeaderboardResult<T extends "player" | "team" = "player" | "team"> = UseQueryResult<
    Entries<T>,
    Error
>

export const useLeaderboard = <R, K extends QueryKey, T extends "player" | "team">(params: {
    initialData?: R
    initialDataUpdatedAt: number
    queryKey: K
    queryFn: QueryFunction<R, K>
    select: (data: R) => Entries<T>
}) =>
    useQuery<R, Error, Entries<T>, K>({
        staleTime: 30_000,
        keepPreviousData: false,
        suspense: true,
        enabled: typeof window !== "undefined",
        ...params
    })
