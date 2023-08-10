import styles from "../../styles/pages/leaderboards.module.css"
import LeaderboardEntryComponent from "./LeaderboardEntryComponent"
import Image from "next/image"
import RaidBanners from "../../images/raid-banners"
import { useLocale } from "../app/LocaleManager"
import { Fragment } from "react"
import StyledButton from "../global/StyledButton"
import Loading from "../global/Loading"
import { ListedRaid } from "../../types/raids"
import { LeaderboardEntry } from "../../types/leaderboards"

type LeaderboardType = "RTA" | "API"

type LeaderboardProps = {
    title: string
    subtitle?: string
    raid: ListedRaid
    entries: LeaderboardEntry[]
    isLoading: boolean
    type: LeaderboardType
    page: number
    setPage: (page: number) => void
}

export const ENTRIES_PER_PAGE = 50

const Leaderboard = ({
    title,
    subtitle,
    raid,
    entries,
    isLoading,
    type,
    page,
    setPage
}: LeaderboardProps) => {
    const { strings } = useLocale()

    const hasMorePages = isLoading || entries.length === ENTRIES_PER_PAGE
    const handleForwards = () => {
        setPage(page + 1)
    }

    const handleBackwards = () => {
        if (page > 0) {
            setPage(page - 1)
        }
    }
    return (
        <main className={styles["main"]}>
            <section className={styles["leaderboard-header"]}>
                <h1>{title}</h1>
                {subtitle && <h3>{subtitle}</h3>}
                <Image
                    priority
                    src={RaidBanners[raid]}
                    alt={strings.raidNames[raid]}
                    fill
                    style={{
                        zIndex: -1,
                        opacity: 0.8,
                        objectPosition: "center",
                        objectFit: "cover"
                    }}
                />
            </section>
            <section className={styles["leaderboard-controls"]}>
                <StyledButton onClick={handleBackwards} disabled={page <= 0}>
                    {strings.back}
                </StyledButton>
                <StyledButton onClick={handleForwards} disabled={!hasMorePages}>
                    {strings.next}
                </StyledButton>
            </section>
            <section className={styles["leaderboard-container"]}>
                {(!isLoading &&
                    entries.map((e, idx) => (
                        <Fragment key={e.id}>
                            <LeaderboardEntryComponent entry={e} />
                            {idx < entries.length - 1 && (
                                <hr className={styles["leaderboard-divider"]} />
                            )}
                        </Fragment>
                    ))) ||
                    new Array(ENTRIES_PER_PAGE).fill(null).map((_, idx) => (
                        <Fragment key={idx}>
                            <Loading wrapperClass={styles["leaderboard-entry-loading"]} />
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
