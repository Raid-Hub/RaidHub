import styles from "../../styles/pages/leaderboards.module.css"
import LeaderboardEntryComponent from "./LeaderboardEntryComponent"
import { useLocale } from "../app/LocaleManager"
import { Fragment, ReactNode } from "react"
import StyledButton from "../reusable/StyledButton"
import Loading from "../global/Loading"
import { LeaderboardEntry } from "../../types/leaderboards"

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

    const hasMorePages = isLoading || entries.length === ENTRIES_PER_PAGE

    return (
        <main className={styles["main"]}>
            <section>{children}</section>
            <div className={styles["leaderboard-controls"]}>
                <StyledButton onClick={refresh}>{"Refresh"}</StyledButton>
                <StyledButton onClick={handleBackwards} disabled={page <= 1}>
                    {strings.back}
                </StyledButton>
                <StyledButton onClick={handleForwards} disabled={!hasMorePages}>
                    {strings.next}
                </StyledButton>
            </div>
            <section className={styles["leaderboard-container"]}>
                {!isLoading
                    ? entries.map((e, idx) => (
                          <Fragment key={e.id}>
                              <LeaderboardEntryComponent entry={e} />
                              {idx < entries.length - 1 && (
                                  <hr className={styles["leaderboard-divider"]} />
                              )}
                          </Fragment>
                      ))
                    : new Array(ENTRIES_PER_PAGE).fill(null).map((_, idx) => (
                          <Fragment key={idx}>
                              <Loading className={styles["leaderboard-entry-loading"]} />
                              {idx < ENTRIES_PER_PAGE - 1 && (
                                  <hr className={styles["leaderboard-divider"]} />
                              )}
                          </Fragment>
                      ))}
            </section>
        </main>
    )
}

export default Leaderboard
