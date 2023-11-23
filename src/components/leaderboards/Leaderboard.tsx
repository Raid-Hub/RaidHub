import styles from "~/styles/pages/leaderboards.module.css"
import LeaderboardEntryComponent from "./LeaderboardEntryComponent"
import { useLocale } from "../app/LocaleManager"
import { Fragment, ReactNode } from "react"
import Loading from "../global/Loading"
import { LeaderboardEntry } from "~/types/leaderboards"
import NextArrow from "~/images/icons/NextArrow"
import PreviousArrow from "~/images/icons/PreviousArrow"
import ReloadArrow from "~/images/icons/ReloadArrow"

type LeaderboardProps = {
    entries: LeaderboardEntry[]
    isLoading: boolean
    page: number
    children: ReactNode
    refresh: () => void
    handleBackwards: () => void
    handleForwards: () => void
}

export const ENTRIES_PER_PAGE = 50

const Leaderboard = ({
    entries,
    isLoading,
    page,
    children,
    refresh,
    handleBackwards,
    handleForwards
}: LeaderboardProps) => {
    const { strings } = useLocale()

    const canGoForward = isLoading || entries.length === ENTRIES_PER_PAGE
    const canGoBack = page >= 2

    const Controls = () => (
        <div className={styles["leaderboard-controls"]}>
            <ReloadArrow
                color="white"
                sx={25}
                onClick={refresh}
                className={styles["btn-control"]}
            />
            <PreviousArrow
                color={canGoBack ? "white" : "gray"}
                sx={20}
                aria-disabled={!canGoBack}
                onClick={canGoBack ? handleBackwards : undefined}
                className={styles["btn-control"]}
            />
            <NextArrow
                color={canGoForward ? "white" : "gray"}
                sx={20}
                aria-disabled={!canGoForward}
                onClick={canGoForward ? handleForwards : undefined}
                className={styles["btn-control"]}
            />
        </div>
    )

    return (
        <main className={styles["main"]}>
            <section>{children}</section>
            <Controls />
            <section className={styles["leaderboard-container"]}>
                {!isLoading
                    ? entries.map((e, idx) => (
                          <Fragment key={e.id}>
                              <LeaderboardEntryComponent entry={e} />
                          </Fragment>
                      ))
                    : new Array(ENTRIES_PER_PAGE).fill(null).map((_, idx) => (
                          <Fragment key={idx}>
                              <Loading className={styles["leaderboard-entry-loading"]} />
                          </Fragment>
                      ))}
                {entries.length > 20 && <Controls />}
            </section>
        </main>
    )
}

export default Leaderboard
