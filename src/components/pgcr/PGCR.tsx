import styles from "../../styles/pages/pgcr.module.css"
import Head from "next/head"
import { usePGCR } from "../../hooks/bungie/usePGCR"
import { BackdropOpacity, Raid, Short } from "../../types/raids"
import { ErrorHandler } from "../../types/generic"
import ActivityHeader from "./ActivityHeader"
import ParticipantsSection from "./ParticipantsSection"
import SummaryStatsGrid from "./SummaryStatsGrid"
import RaidCardBackground from "../../images/raid-backgrounds"
import Image from "next/image"

export type PGCRProps = {
    activityId: string | undefined
    errorHandler: ErrorHandler
}

const PGCR = ({ activityId, errorHandler }: PGCRProps) => {
    const { pgcr, loadingState: pgcrLoadingState } = usePGCR({ activityId, errorHandler })
    return (
        <main className={styles["main"]}>
            <Head>
                <title key="title">
                    {pgcr?.raid ? `${Short[pgcr.raid]} ${activityId} | RaidHub` : "RaidHub"}
                </title>
            </Head>
            <section className={styles["summary-card"]}>
                <Image
                    priority
                    className={styles["summary-card-background"]}
                    src={RaidCardBackground[pgcr?.raid ?? Raid.NA]}
                    alt="background image"
                    fill
                    style={{ opacity: BackdropOpacity[pgcr?.raid ?? Raid.NA] }}
                />
                <ActivityHeader activity={pgcr} pgcrLoadingState={pgcrLoadingState} />
                <ParticipantsSection
                    raid={pgcr?.raid ?? Raid.NA}
                    players={pgcr?.players ?? []}
                    pgcrLoadingState={pgcrLoadingState}
                />
            </section>
            <section className={styles["summary-stats"]}>
                <SummaryStatsGrid activity={pgcr} />
            </section>
        </main>
    )
}

export default PGCR
