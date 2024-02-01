import { DehydrateOptions, QueryClient, dehydrate } from "@tanstack/react-query"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { BungieClientProtocol, BungieFetchConfig } from "bungie-net-core"
import { BungieMembershipType } from "bungie-net-core/models"
import superjson from "superjson"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import { getBasicProfile } from "~/services/bungie/getProfile"
import {
    Leaderboard,
    getIndividualGlobalLeaderboard,
    getIndividualLeaderboard,
    getLeaderboard,
    leaderboardQueryKey
} from "~/services/raidhub/getLeaderboard"
import { getPlayer, playerQueryKey } from "~/services/raidhub/getPlayer"
import {
    getSpeedrunComLeaderboard,
    rtaQueryKey
} from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import { ListedRaid } from "~/types/raidhub-api"
import BungieQuery, { QueryFn } from "~/util/bungieQuery"
import prisma from "./prisma"
import { appRouter } from "./trpc/router"

export const createServerSideQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30
            }
        }
    })

export const createTrpcServerSideHelpers = () =>
    createServerSideHelpers({
        router: appRouter,
        transformer: superjson,
        ctx: { req: undefined, res: undefined, session: null, prisma },
        queryClient: createServerSideQueryClient()
    })

const createBungieServerSideHelpers = (queryClient: QueryClient) =>
    new ServerSideBungieClient(queryClient)

export async function prefetchDestinyProfile(
    {
        destinyMembershipId,
        destinyMembershipType
    }: {
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    },
    queryClient: QueryClient
) {
    const helpers = createBungieServerSideHelpers(queryClient)

    await helpers.profile.prefetchQuery({
        destinyMembershipId,
        membershipType: destinyMembershipType
    })
    await helpers.queryClient.invalidateQueries({
        queryKey: helpers.profile.queryKey({
            destinyMembershipId,
            membershipType: destinyMembershipType
        })
    }) // we prefetch but mark it as invalid. This allows SSR but it refetches on load

    return helpers.dehydrate()
}

export async function prefetchRaidHubProfile(
    destinyMembershipId: string,
    helpers: ReturnType<typeof createTrpcServerSideHelpers>
) {
    await helpers.profile.byDestinyMembershipId.prefetch({
        destinyMembershipId
    })
}

export async function prefetchRaidHubPlayer(destinyMembershipId: string, queryClient: QueryClient) {
    await queryClient.prefetchQuery(playerQueryKey(destinyMembershipId), () =>
        getPlayer(destinyMembershipId)
    )

    return dehydrate(queryClient)
}

export async function prefetchLeaderboard<R extends ListedRaid>(
    {
        raid,
        board,
        params,
        pages
    }: { raid: R; board: Leaderboard; params: string[]; pages: number },
    queryClient: QueryClient
) {
    // we prefetch the first page at build time
    await Promise.all(
        new Array(pages).fill(undefined).map((_, page) =>
            queryClient.prefetchQuery(
                leaderboardQueryKey(raid, board, params, page + 1),
                () => getLeaderboard(raid, board, params, page + 1),
                {
                    staleTime: 2 * 60000 // 2 minutes
                }
            )
        )
    )

    return dehydrate(queryClient)
}

export async function prefetchIndividualLeaderboard<R extends ListedRaid | "global">(
    { raid, board, pages, count }: { raid: R; board: Leaderboard; pages: number; count: number },
    queryClient: QueryClient
) {
    // we prefetch the first page at build time
    await Promise.all(
        new Array(pages).fill(undefined).map((_, idx) =>
            queryClient.prefetchQuery(
                leaderboardQueryKey(raid, board, [], idx + 1),
                () =>
                    raid === "global"
                        ? getIndividualGlobalLeaderboard(
                              board as
                                  | Leaderboard.Clears
                                  | Leaderboard.FullClears
                                  | Leaderboard.Sherpa,
                              idx + 1,
                              count
                          )
                        : getIndividualLeaderboard(raid, board, idx + 1, count),
                {
                    staleTime: 2 * 60000 // 2 minutes
                }
            )
        )
    )

    return dehydrate(queryClient)
}

export async function prefetchSpeedrunComLeaderboard(
    { raid, category }: { raid: ListedRaid; category: string | null },
    queryClient: QueryClient
) {
    await queryClient.prefetchQuery(rtaQueryKey(raid, category), () =>
        getSpeedrunComLeaderboard({ raid, category })
    ),
        {
            staleTime: 120 * 1000 // 2 minutes
        }

    return dehydrate(queryClient)
}

class ServerSideBungieClient implements BungieClientProtocol {
    queryClient: QueryClient

    constructor(queryClient: QueryClient) {
        this.queryClient = queryClient
    }

    private query<TParams, TData>({
        fn,
        key
    }: {
        fn: (client: BungieClientProtocol) => QueryFn<TParams, TData>
        key: string
    }) {
        return BungieQuery<TParams, TData>({ queryClient: this.queryClient }, fn(this), key)
    }

    get profile() {
        return this.query(getBasicProfile)
    }

    dehydrate(options?: DehydrateOptions) {
        return dehydrate(this.queryClient, options)
    }

    async fetch<T>(config: BungieFetchConfig): Promise<T> {
        const apiKey = process.env.BUNGIE_API_KEY
        if (!apiKey) {
            throw new Error("Missing BUNGIE_API_KEY")
        }

        const payload = {
            method: config.method,
            body: config.body,
            headers: config.headers ?? {}
        }

        if (config.url.pathname.match(/\/Platform\//)) {
            payload.headers["X-API-KEY"] = apiKey
        }

        const res = await fetch(config.url, payload)
        const data = await res.json()
        if (data.ErrorCode && data.ErrorCode !== 1) {
            throw new BungieAPIError(data)
        } else if (!res.ok) {
            throw new Error("Error parsing response")
        }
        return data as T
    }
}
