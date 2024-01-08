import styles from "~/styles/pages/leaderboards.module.css"
import {
    Leaderboard,
    getIndiviualLeaderboard,
    leaderboardQueryKey
} from "~/services/raidhub/getLeaderboard"
import { ListedRaid } from "~/types/raids"
import { useLocale } from "../app/LocaleManager"
import { usePage } from "~/hooks/util/usePage"
import Head from "next/head"
import { useQuery } from "@tanstack/react-query"
import { Controls } from "./LeaderboardControls"
import Loading from "../global/Loading"
import Link from "next/link"

const ENTRIES_PER_PAGE = 50

export type IndividualLeaderboadProps = {
    raid: ListedRaid
    board: Leaderboard
}

export const IndividualLeaderboad = ({ raid, board }: IndividualLeaderboadProps) => {
    const { strings } = useLocale()
    const { page, handleBackwards, handleForwards } = usePage()
    const raidName = strings.raidNames[raid]
    const query = useQuery({
        queryKey: leaderboardQueryKey(raid, board, [], page),
        queryFn: () => getIndiviualLeaderboard(raid, board, page)
    })

    const title = `${raidName} | ${board} Leaderboards`
    const description = `${board} Leaderboards for ${raidName}`
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
            </Head>

            <main className={styles["main"]}>
                <section>{"todo"}</section>
                <Controls
                    entriesLength={query.data?.length ?? 0}
                    entriesPerPage={ENTRIES_PER_PAGE}
                    isLoading={query.isLoading}
                    currentPage={page}
                    refresh={query.refetch}
                    handleBackwards={handleBackwards}
                    handleForwards={handleForwards}
                />
                <section className={styles["leaderboard-container"]}>
                    {query.isSuccess
                        ? query.data.map(e => (
                              <div key={e.player.membershipId}>
                                  <Link
                                      href={`/profile/${e.player.membershipType}/${e.player.membershipId}`}>
                                      {e.player.bungieGlobalDisplayName || e.player.displayName}
                                  </Link>
                                  <div>{e.value}</div>
                              </div>
                          ))
                        : new Array(ENTRIES_PER_PAGE)
                              .fill(null)
                              .map((_, idx) => (
                                  <Loading
                                      key={idx}
                                      className={styles["leaderboard-entry-loading"]}
                                  />
                              ))}
                    {(query.data?.length ?? 0) > 20 && (
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
