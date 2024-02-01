import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Head from "next/head"
import { usePage } from "~/hooks/util/usePage"
import { getWorldfirstLeaderboard, leaderboardQueryKey } from "~/services/raidhub/getLeaderboard"
import {
    searchLeaderboardPlayer,
    searchLeaderboardPlayerMutationKey
} from "~/services/raidhub/searchLeaderboard"
import { ListedRaid, RaidHubWorldFirstLeaderboardCategory } from "~/types/raidhub-api"
import { LEADERBOARD_ENTRIES_PER_PAGE } from "~/util/constants"
import { toCustomDateString } from "~/util/presentation/formatting"
import { useLocale } from "../app/LocaleManager"
import { useRaidHubManifest } from "../app/RaidHubManifestManager"
import ActivityLeaderboard from "./ActivityLeaderboard"
import WorldFirstHeader from "./WorldFirstHeader"

export default function MickeyMouseLeaderboard({
    raid,
    board,
    descriptor
}: {
    raid: ListedRaid
    board: RaidHubWorldFirstLeaderboardCategory
    descriptor: string
}) {
    const { locale } = useLocale()
    const { getUrlPathForRaid, getRaidString } = useRaidHubManifest()
    const { page, handleBackwards, handleForwards, setPage } = usePage(["player"])
    const raidName = getRaidString(raid)
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, board, {
            page: page,
            count: LEADERBOARD_ENTRIES_PER_PAGE
        }),
        queryFn: () =>
            getWorldfirstLeaderboard({
                raid: getUrlPathForRaid(raid),
                category: board,
                page,
                count: LEADERBOARD_ENTRIES_PER_PAGE
            })
    })

    const queryClient = useQueryClient()

    const searchParams = {
        type: "worldfirst",
        raid,
        category: board,
        page,
        count: LEADERBOARD_ENTRIES_PER_PAGE
    } as const

    const { mutate: searchForLeaderboardPlayer, isLoading: isLoadingSearch } = useMutation({
        mutationKey: searchLeaderboardPlayerMutationKey(searchParams),
        mutationFn: (membershipId: string) => searchLeaderboardPlayer(searchParams, membershipId),
        onSuccess(result) {
            queryClient.setQueryData(
                leaderboardQueryKey(raid, board, {
                    page: page,
                    count: LEADERBOARD_ENTRIES_PER_PAGE
                }),
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

            <ActivityLeaderboard
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
            </ActivityLeaderboard>
        </>
    )
}
