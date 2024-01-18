import styles from "~/styles/pages/leaderboards.module.css"
import LeaderboardEntryComponent from "./LeaderboardEntryComponent"
import { ReactNode } from "react"
import Loading from "../global/Loading"
import { LeaderboardEntry } from "~/types/leaderboards"
import { Controls } from "./LeaderboardControls"

type LeaderboardProps = {
    entries: LeaderboardEntry[]
    isLoading: boolean
    page: number
    refresh: () => void
    handleBackwards: () => void
    handleForwards: () => void
    children: ReactNode
}

export const ENTRIES_PER_PAGE = 50

const Leaderboard = ({
    entries,
    isLoading,
    page,
    refresh,
    handleBackwards,
    handleForwards,
    children
}: LeaderboardProps) => {
    return (
        <main className={styles["main"]}>
            <section>{children}</section>
            <Controls
                entriesLength={entries.length}
                entriesPerPage={ENTRIES_PER_PAGE}
                isLoading={isLoading}
                currentPage={page}
                refresh={refresh}
                handleBackwards={handleBackwards}
                handleForwards={handleForwards}
            />
            <section className={styles["leaderboard-container"]}>
                {!isLoading
                    ? entries.map(e => <LeaderboardEntryComponent entry={e} key={e.id} />)
                    : new Array(ENTRIES_PER_PAGE)
                          .fill(null)
                          .map((_, idx) => (
                              <Loading key={idx} className={styles["leaderboard-entry-loading"]} />
                          ))}
                {entries.length > 20 && (
                    <Controls
                        entriesLength={entries.length}
                        entriesPerPage={ENTRIES_PER_PAGE}
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

export default Leaderboard
