import styles from "../../styles/pages/pgcr.module.css"
import Head from "next/head"
import { usePGCR } from "../../hooks/bungie/usePGCR"
import { Backdrop, Raid, Short } from "../../util/destiny/raid"
import { ErrorHandler } from "../../types/generic"
import ActivityHeader from "./ActivityHeader"
import ParticipantsSection from "./ParticipantsSection"
import SummaryStatsGrid from "./SummaryStatsGrid"

export type PGCRProps = {
    activityId: string
    errorHandler: ErrorHandler
}

const PGCR = ({ activityId, errorHandler }: PGCRProps) => {
    const { pgcr, loadingState: pgcrLoadingState } = usePGCR({ activityId, errorHandler })
    return (
        <main className={styles["main"]}>
            <Head>
                <title>
                    {pgcr?.raid ? `${Short[pgcr.raid]} ${activityId} | RaidHub` : "RaidHub"}
                </title>
            </Head>
            <section className={styles["summary-card"]}>
                <div className="background-img" style={Backdrop[pgcr?.raid ?? Raid.NA]} />
                <ActivityHeader activity={pgcr} pgcrLoadingState={pgcrLoadingState} />
                <ParticipantsSection
                    raid={pgcr?.raid ?? Raid.NA}
                    players={pgcr?.players ?? []}
                    characters={pgcr?.entries ?? []}
                    pgcrLoadingState={pgcrLoadingState}
                    errorHandler={errorHandler}
                />
            </section>
            <section className={styles["summary-stats"]}>
                <SummaryStatsGrid activity={pgcr} />
            </section>
        </main>
    )
}

export default PGCR
