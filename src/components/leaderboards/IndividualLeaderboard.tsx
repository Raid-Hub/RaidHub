import styles from "~/styles/pages/leaderboards.module.css"
import {
    Leaderboard,
    getIndividualLeaderboard,
    leaderboardQueryKey
} from "~/services/raidhub/getLeaderboard"
import { ListedRaid } from "~/types/raids"
import { useLocale } from "../app/LocaleManager"
import { usePage } from "~/hooks/util/usePage"
import Head from "next/head"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Controls } from "./LeaderboardControls"
import Loading from "../global/Loading"
import { IndividualLeaderboardEntryComponent } from "./IndividualLeaderboardEntry"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import CloudflareImage from "~/images/CloudflareImage"
import RaidBanners from "~/images/raid-banners"
import {
    searchLeaderboardPlayer,
    searchLeaderboardPlayerQueryKey
} from "~/services/raidhub/searchLeaderboard"
import { useRouter } from "next/router"

const ENTRIES_PER_PAGE = 50

export type IndividualLeaderboadProps = {
    raid: ListedRaid
    board: Exclude<Leaderboard, Leaderboard.WorldFirst>
}

export const IndividualLeaderboad = ({ raid, board }: IndividualLeaderboadProps) => {
    const { strings } = useLocale()
    const { page, handleBackwards, handleForwards, setPage } = usePage()
    const queryClient = useQueryClient()
    const raidName = strings.raidNames[raid]
    const boardName = strings.individualLeaderboards[board]
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, board, [], page),
        queryFn: () => getIndividualLeaderboard(raid, board, page)
    })
    const title = `${raidName} | ${boardName} Leaderboards`
    const description = `${boardName} Leaderboards for ${raidName}`

    const searchParams = {
        type: "invidual",
        raid,
        board
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
                leaderboardQueryKey(raid, board, [], result.page),
                result.entries
            )
        }
    })

    const { query: queryParams } = useRouter()
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
            </Head>

            <main className={styles["main"]}>
                <section className={styles["individual-leaderboard-banner"]}>
                    <div>
                        <h1 className={styles["header-h1"]}>{boardName}</h1>
                        <h3 className={styles["header-h3"]}>{raidName}</h3>
                    </div>
                    <CloudflareImage
                        priority
                        cloudflareId={RaidBanners[raid]}
                        alt={raidName}
                        fill
                    />
                </section>
                <Controls
                    entriesLength={query.data?.length ?? 0}
                    entriesPerPage={ENTRIES_PER_PAGE}
                    isLoading={query.isLoading}
                    currentPage={page}
                    refresh={query.refetch}
                    handleBackwards={handleBackwards}
                    handleForwards={handleForwards}
                    searchFn={searchForLeaderboardPlayer}
                />
                <section className={styles["leaderboard-container"]}>
                    {isLoadingSearch ? (
                        <div>Searching...</div>
                    ) : query.isLoading || query.isRefetching ? (
                        new Array(ENTRIES_PER_PAGE)
                            .fill(null)
                            .map((_, idx) => (
                                <Loading
                                    key={idx}
                                    className={styles["leaderboard-entry-loading"]}
                                />
                            ))
                    ) : (
                        query.data?.map(e => (
                            <IndividualLeaderboardEntryComponent
                                entry={{
                                    displayName:
                                        e.player.bungieGlobalDisplayName || e.player.displayName,
                                    iconURL: bungieIconUrl(e.player.iconPath),
                                    id: e.player.membershipId,
                                    rank: e.rank,
                                    url: `/profile/${e.player.membershipType}/${e.player.membershipId}`,
                                    value: e.value
                                }}
                                key={e.player.membershipId}
                                isSearched={queryParams["player"] === e.player.membershipId}
                            />
                        ))
                    )}
                    {!isLoadingSearch && (query.data?.length ?? 0) > 20 && (
                        <Controls
                            entriesLength={query.data?.length ?? 0}
                            entriesPerPage={ENTRIES_PER_PAGE}
                            isLoading={query.isLoading}
                            currentPage={page}
                            refresh={query.refetch}
                            handleBackwards={handleBackwards}
                            handleForwards={handleForwards}
                        />
                    )}
                </section>
            </main>
        </>
    )
}
