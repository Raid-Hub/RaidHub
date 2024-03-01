import { ReactNode } from "react"
import styles from "~/styles/pages/leaderboards.module.css"
import { LeaderboardEntry } from "~/types/leaderboards"
import { LEADERBOARD_ENTRIES_PER_PAGE } from "~/util/constants"
import LeaderboardEntryComponent from "../../app/leaderboards/LeaderboardEntryComponent"
import Loading from "../../components/Loading"
import { Controls } from "./LeaderboardControls"

const ActivityLeaderboard = ({
    entries,
    isLoading,
    page,
    refresh,
    handleBackwards,
    handleForwards,
    isLoadingSearch,
    searchForPlayer,
    children
}: {
    entries: LeaderboardEntry[]
    isLoading: boolean
    page: number
    refresh: () => void
    handleBackwards: () => void
    handleForwards: () => void
    children: ReactNode
} & {
    searchForPlayer?: (membershipId: string) => void
    isLoadingSearch?: boolean
}) => {
    return (
        <main className={styles["main"]}>
            <section>{children}</section>
            <Controls
                entriesLength={entries.length}
                entriesPerPage={LEADERBOARD_ENTRIES_PER_PAGE}
                isLoading={isLoading}
                currentPage={page}
                refresh={refresh}
                handleBackwards={handleBackwards}
                handleForwards={handleForwards}
                searchFn={searchForPlayer}
            />
            <section className={styles["leaderboard-container"]}>
                {isLoadingSearch ? (
                    <div>Searching...</div>
                ) : !isLoading ? (
                    entries.map(e => <LeaderboardEntryComponent entry={e} key={e.id} />)
                ) : (
                    new Array(LEADERBOARD_ENTRIES_PER_PAGE)
                        .fill(null)
                        .map((_, idx) => (
                            <Loading key={idx} className={styles["leaderboard-entry-loading"]} />
                        ))
                )}
                {!isLoadingSearch && entries.length > 20 && (
                    <Controls
                        entriesLength={entries.length}
                        entriesPerPage={LEADERBOARD_ENTRIES_PER_PAGE}
                        isLoading={isLoading}
                        currentPage={page}
                        refresh={refresh}
                        handleBackwards={handleBackwards}
                        handleForwards={handleForwards}
                    />
                )}
            </section>
        </main>
    )
}

export default ActivityLeaderboard
