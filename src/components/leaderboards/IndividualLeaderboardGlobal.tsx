import styles from "~/styles/pages/leaderboards.module.css"
import {
    Leaderboard,
    getIndividualGlobalLeaderboard,
    leaderboardQueryKey
} from "~/services/raidhub/getLeaderboard"
import { useLocale } from "../app/LocaleManager"
import { usePage } from "~/hooks/util/usePage"
import Head from "next/head"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Controls } from "./LeaderboardControls"
import Loading from "../global/Loading"
import { IndividualLeaderboardEntryComponent } from "./IndividualLeaderboardEntry"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import CloudflareImage from "~/images/CloudflareImage"
import {
    searchLeaderboardPlayer,
    searchLeaderboardPlayerQueryKey
} from "~/services/raidhub/searchLeaderboard"

const ENTRIES_PER_PAGE = 50

export const IndividualLeaderboadGlobal = ({
    board
}: {
    board: Leaderboard.Clears | Leaderboard.Sherpa | Leaderboard.FullClears
}) => {
    const { strings } = useLocale()
    const { page, handleBackwards, handleForwards, setPage } = usePage()
    const boardName = strings.individualLeaderboads[board]
    const query = useQuery({
        queryKey: leaderboardQueryKey("global", board, [], page),
        queryFn: () => getIndividualGlobalLeaderboard(board, page)
    })

    const queryClient = useQueryClient()

    const searchParams = {
        type: "global",
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
                leaderboardQueryKey("global", board, [], result.page),
                result.entries
            )
        }
    })

    const title = `Total ${boardName} Leaderboards`
    const description = `${boardName} for all Raids in Destiny 2`
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
                        <h1 className={styles["header-h1"]}>Total {boardName}</h1>
                    </div>
                    <CloudflareImage
                        priority
                        cloudflareId={"5e4dc4de-9417-4aef-2a48-aea495ae3500"}
                        alt={"RaidHub banner"}
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
