import { DehydrateOptions, QueryClient, dehydrate } from "@tanstack/react-query"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { Leaderboard, getLeaderboard, leaderboardQueryKey } from "~/services/raidhub/getLeaderboard"
import {
    getSpeedrunComLeaderboard,
    rtaQueryKey
} from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import { ListedRaid } from "~/types/raids"
import { appRouter } from "./trpc/router"
import prisma from "./prisma"
import superjson from "superjson"
import { BungieMembershipType } from "bungie-net-core/models"
import { BungieClientProtocol, BungieFetchConfig } from "bungie-net-core"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import BungieQuery, { QueryFn } from "~/util/bungieQuery"
import { getBasicProfile } from "~/services/bungie/getProfile"

const createServerSideQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 0
            }
        }
    })

const createTrpcServerSideHelpers = () =>
    createServerSideHelpers({
        router: appRouter,
        transformer: superjson,
        ctx: { req: undefined, res: undefined, session: null, prisma },
        queryClient: createServerSideQueryClient()
    })

const createBungieServerSideHelpers = () =>
    new ServerSideBungieClient(createServerSideQueryClient())

export async function prefetchDestinyProfile({
    destinyMembershipId,
    destinyMembershipType
}: {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
}) {
    const helpers = createBungieServerSideHelpers()

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

export async function prefetchRaidHubProfile(destinyMembershipId: string) {
    const helpers = createTrpcServerSideHelpers()

    await helpers.profile.byDestinyMembershipId.prefetch({
        destinyMembershipId
    })

    return helpers.dehydrate()
}

export async function prefetchLeaderboard<R extends ListedRaid>(
    raid: R,
    board: Leaderboard,
    params: string[],
    pages: number
) {
    const queryClient = createServerSideQueryClient()

    // we prefetch the first page at build time
    const staleTime = 24 * 60 * 60 * 1000 // 24 hours
    await Promise.all(
        new Array(pages).fill(undefined).map((_, idx) =>
            queryClient.prefetchQuery(
                leaderboardQueryKey(raid, board, params, idx),
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

export async function prefetchSpeedrunComLeaderboard(raid: ListedRaid, category: string | null) {
    const queryClient = createServerSideQueryClient()
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
        return BungieQuery<TParams, TData>(this.queryClient, fn(this), key)
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
