import { Hydrate, dehydrate, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { useLocale } from "~/components/app/LocaleManager"
import WorldFirstHeader from "~/components/leaderboards/WorldFirstHeader"
import { usePage } from "~/hooks/util/usePage"
import { createServerSideQueryClient, prefetchLeaderboard } from "~/server/serverQueryClient"
import { Leaderboard, getLeaderboard, leaderboardQueryKey } from "~/services/raidhub/getLeaderboard"
import {
    searchLeaderboardPlayer,
    searchLeaderboardPlayerQueryKey
} from "~/services/raidhub/searchLeaderboard"
import { ListedRaid } from "~/types/raidhub-api"
import { UrlPathsToRaid } from "~/util/destiny/raidUtils"
import { toCustomDateString } from "~/util/presentation/formatting"
import { zRaidURIComponent } from "~/util/zod"

type WorldsFirstLeaderboadProps = {
    raid: ListedRaid
    dehydratedState: unknown
}

export const getStaticPaths: GetStaticPaths<{ raid: string }> = async () => {
    return process.env.APP_ENV === "local"
        ? {
              paths: [],
              fallback: "blocking"
          }
        : {
              paths: Object.keys(UrlPathsToRaid).map(raid => ({
                  params: {
                      raid
                  }
              })),
              fallback: false
          }
}

export const getStaticProps: GetStaticProps<WorldsFirstLeaderboadProps, { raid: string }> = async ({
    params
}) => {
    try {
        const raid = zRaidURIComponent.parse(params?.raid)

        const paramStrings = [
            (RaidsWithReprisedContest as readonly ListedRaid[]).includes(raid)
                ? "challenge"
                : "normal"
        ]

        const queryClient = createServerSideQueryClient()
        await prefetchLeaderboard(
            {
                raid: raid,
                board: Leaderboard.WorldFirst,
                params: paramStrings,
                pages: 2
            },
            queryClient
        )

        return {
            props: {
                raid,
                dehydratedState: dehydrate(queryClient)
            },
            revalidate: 3600 * 24 // 24 hours
        }
    } catch (e) {
        console.error(e)
        return { notFound: true }
    }
}

export default function WorldsFirstLeaderboadPage({
    raid,
    dehydratedState
}: WorldsFirstLeaderboadProps) {
    return (
        <Hydrate state={dehydratedState}>
            <WorldsFirstLeaderboad raid={raid} />
        </Hydrate>
    )
}

const WorldsFirstLeaderboad = ({ raid }: { raid: ListedRaid }) => {
    const { strings, locale } = useLocale()
    const { page, handleBackwards, handleForwards, setPage } = usePage(["player"])
    const raidName = strings.raidNames[raid]
    const params = [
        (RaidsWithReprisedContest as readonly ListedRaid[]).includes(raid) ? "challenge" : "normal"
    ]
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, Leaderboard.WorldFirst, params, page),
        queryFn: () =>
            getLeaderboard({
                raid: raid,
                board: Leaderboard.WorldFirst,
                params,
                page,
                count: ENTRIES_PER_PAGE
            })
    })

    const queryClient = useQueryClient()

    const searchParams = {
        type: "worldfirst",
        raid,
        board: Leaderboard.WorldFirst,
        params
    } as const

    const searchQueryParams = {
        page,
        count: ENTRIES_PER_PAGE
    }

    const { mutate: searchForLeaderboardPlayer, isLoading: isLoadingSearch } = useMutation({
        mutationKey: searchLeaderboardPlayerQueryKey(searchParams, searchQueryParams),
        mutationFn: (membershipId: string) =>
            searchLeaderboardPlayer(searchParams, searchQueryParams, membershipId),
        onSuccess(result) {
            setPage(result.page)
            queryClient.setQueryData(
                leaderboardQueryKey(raid, Leaderboard.WorldFirst, [], result.page),
                result.entries
            )
        }
    })

    const title = `${raidName} | World First Leaderboards`
    const date = query.data?.date ? new Date(query.data.date) : null
    const raidDate = date ? toCustomDateString(date, locale) : ""
    const description = `World First Race Leaderboards for ${raidName} on ${raidDate}`
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
                <meta name="date" content={date?.toISOString().slice(0, 10)} />
            </Head>

            <LeaderboardComponent
                entries={query.data?.entries ?? []}
                isLoading={query.isLoading || query.isRefetching}
                page={page}
                handleBackwards={handleBackwards}
                handleForwards={handleForwards}
                refresh={query.refetch}
                searchForPlayer={searchForLeaderboardPlayer}
                isLoadingSearch={isLoadingSearch}>
                <WorldFirstHeader
                    title={"World First " + raidName}
                    subtitle={raidDate}
                    raid={raid}
                />
            </LeaderboardComponent>
        </>
    )
}
