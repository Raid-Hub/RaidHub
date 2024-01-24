import { ListedRaid } from "~/types/raids"
import { useLocale } from "../app/LocaleManager"
import { usePage } from "~/hooks/util/usePage"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Leaderboard, getLeaderboard, leaderboardQueryKey } from "~/services/raidhub/getLeaderboard"
import { toCustomDateString } from "~/util/presentation/formatting"
import Head from "next/head"
import LeaderboardComponent, { ENTRIES_PER_PAGE } from "./Leaderboard"
import WorldFirstHeader from "./WorldFirstHeader"
import {
    searchLeaderboardPlayer,
    searchLeaderboardPlayerQueryKey
} from "~/services/raidhub/searchLeaderboard"

export default function MickeyMouseLeaderboard({
    raid,
    params,
    descriptor
}: {
    raid: ListedRaid
    params: string[]
    descriptor: string
}) {
    const { strings, locale } = useLocale()
    const { page, handleBackwards, handleForwards, setPage } = usePage(["player"])
    const raidName = strings.raidNames[raid]
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, Leaderboard.WorldFirst, params, page),
        queryFn: () => getLeaderboard(raid, Leaderboard.WorldFirst, params, page)
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
            searchLeaderboardPlayer<"worldfirst">(searchParams, searchQueryParams, membershipId),
        onSuccess(result) {
            queryClient.setQueryData(
                leaderboardQueryKey(raid, Leaderboard.WorldFirst, [], result.page),
                result.entries
            )
            setPage(result.page)
        }
    })

    const title = `${raidName} | ${descriptor} Leaderboards`
    const date = query.data?.date ? new Date(query.data.date) : null
    const raidDate = date ? toCustomDateString(date, locale) : ""
    const description = `${descriptor} Leaderboards for ${raidName} on ${raidDate}`

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
                isLoadingSearch={isLoadingSearch}
                searchForPlayer={searchForLeaderboardPlayer}
                page={page}
                handleBackwards={handleBackwards}
                handleForwards={handleForwards}
                refresh={query.refetch}>
                <WorldFirstHeader
                    title={descriptor + " " + raidName}
                    subtitle={date ? toCustomDateString(date, locale) : ""}
                    raid={raid}
                />
            </LeaderboardComponent>
        </>
    )
}
