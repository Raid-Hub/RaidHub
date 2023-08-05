import styles from "../../styles/pages/leaderboards.module.css"
import { useQuery } from "@tanstack/react-query"
import { usePage } from "../../hooks/util/usePage"
import { GetLeaderboardParams, getLeaderboard } from "../../services/raidhub/getLeaderboard"
import LeaderboardEntry from "./LeaderboardEntry"
import { AvailableRaid } from "../../types/raids"
import Image from "next/image"
import RaidBanners from "../../images/raid-banners"
import { useLocale } from "../app/LocaleManager"
import { useState } from "react"
import StyledButton from "../global/StyledButton"
import Loading from "../global/Loading"

type LeaderboardProps = {
    title: string
    subtitle: string
    params: GetLeaderboardParams
}

const useLeaderboard = (params: GetLeaderboardParams, page: number) =>
    useQuery({
        queryKey: ["leaderboards", params.toString(), page],
        queryFn: () => getLeaderboard(params, page)
    })

const PER_PAGE = 50
const Leaderboard = ({ title, subtitle, params }: LeaderboardProps) => {
    const [page, setPage] = usePage()
    const [firstIndex, setFirstIndex] = useState(1)
    const { data, isLoading } = useLeaderboard(params, page)
    const { strings } = useLocale()

    const hasMorePages = true

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
            <div className={styles["leaderboard-header"]}>
                <h1>{title}</h1>
                <h3>{subtitle}</h3>
                <div className={styles["leaderboard-controls"]}>
                    <StyledButton onClick={handleBackwards} disabled={page <= 0}>
                        {strings.back}
                    </StyledButton>
                    <StyledButton onClick={handleForwards} disabled={!hasMorePages}>
                        {strings.next}
                    </StyledButton>
                </div>
                <Image
                    priority
                    src={RaidBanners[params.raid]}
                    alt={strings.raidNames[params.raid]}
                    fill
                    style={{
                        zIndex: -1,
                        opacity: 0.8,
                        objectPosition: "center",
                        objectFit: "cover"
                    }}
                />
            </div>
            <section className={styles["leaderboard-container"]}>
                {data?.entries.map((e, idx) => (
                    <>
                        <LeaderboardEntry
                            entry={e}
                            key={e.activityDetails.instanceId}
                            rank={idx + PER_PAGE * page + 1}
                        />
                        {idx < data?.entries.length - 1 && (
                            <hr className={styles["leaderboard-divider"]} />
                        )}
                    </>
                )) ??
                    new Array(PER_PAGE).fill(null).map((_, idx) => (
                        <>
                            <Loading wrapperClass={styles["leaderboard-entry-loading"]} key={idx} />
                            {idx < PER_PAGE - 1 && <hr className={styles["leaderboard-divider"]} />}
                        </>
                    ))}
            </section>
        </main>
    )
}

export default Leaderboard
