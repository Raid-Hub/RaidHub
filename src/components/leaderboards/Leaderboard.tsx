import styles from "../../styles/pages/leaderboards.module.css"
import { useQuery } from "@tanstack/react-query"
import { usePage } from "../../hooks/util/usePage"
import { GetLeaderboardParams, getLeaderboard } from "../../services/raidhub/getLeaderboard"
import LeaderboardEntry from "./LeaderboardEntry"
import Image from "next/image"
import RaidBanners from "../../images/raid-banners"
import { useLocale } from "../app/LocaleManager"
import { Fragment } from "react"
import StyledButton from "../global/StyledButton"
import Loading from "../global/Loading"
import { AvailableRaid } from "../../types/raids"

type LeaderboardProps = {
    title: string
    subtitle: string
    raid: AvailableRaid
    path: string[]
}

const useLeaderboard = (params: GetLeaderboardParams, page: number) =>
    useQuery({
        queryKey: ["leaderboards", params, page],
        queryFn: () => getLeaderboard(params, page)
    })

const PER_PAGE = 50
const Leaderboard = ({ title, subtitle, raid, path }: LeaderboardProps) => {
    const [page, setPage] = usePage()
    const { data, isLoading } = useLeaderboard(path, page)
    const { strings } = useLocale()

    const hasMorePages = true // todo

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
                <h3>{subtitle}</h3>
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
                    data?.entries.map((e, idx) => (
                        <Fragment key={e.activityDetails.instanceId}>
                            <LeaderboardEntry entry={e} rank={idx + PER_PAGE * page + 1} />
                            {idx < data?.entries.length - 1 && (
                                <hr className={styles["leaderboard-divider"]} />
                            )}
                        </Fragment>
                    ))) ||
                    new Array(PER_PAGE).fill(null).map((_, idx) => (
                        <Fragment key={idx}>
                            <Loading wrapperClass={styles["leaderboard-entry-loading"]} />
                            {idx < PER_PAGE - 1 && <hr className={styles["leaderboard-divider"]} />}
                        </Fragment>
                    ))}
            </section>
        </main>
    )
}

export default Leaderboard
