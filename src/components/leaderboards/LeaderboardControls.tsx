import styles from "~/styles/pages/leaderboards.module.css"
import ReloadArrow from "~/images/icons/ReloadArrow"
import PreviousArrow from "~/images/icons/PreviousArrow"
import NextArrow from "~/images/icons/NextArrow"

export const Controls = ({
    isLoading,
    entriesLength,
    entriesPerPage,
    currentPage,
    refresh,
    handleBackwards,
    handleForwards
}: {
    entriesLength: number
    entriesPerPage: number
    isLoading: boolean
    currentPage: number
    refresh: () => void
    handleBackwards: () => void
    handleForwards: () => void
}) => {
    const canGoForward = isLoading || entriesLength === entriesPerPage
    const canGoBack = currentPage > 1
    return (
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
}
