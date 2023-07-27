import styles from "../../styles/pages/pgcr.module.css"
import Head from "next/head"
// import { usePGCR } from "../../hooks/bungie/usePGCR"
import { BackdropOpacity, Raid, Short } from "../../types/raids"
import { ErrorHandler } from "../../types/generic"
import ActivityHeader from "./ActivityHeader"
import ParticipantsSection from "./ParticipantsSection"
import SummaryStatsGrid from "./SummaryStatsGrid"
import RaidCardBackground from "../../images/raid-backgrounds"
import Image from "next/image"
import { usePGCR } from "../../hooks/bungie/usePGCR"

export type PGCRProps = {
    activityId: string
    errorHandler: ErrorHandler
}

const PGCR = ({ activityId, errorHandler }: PGCRProps) => {
    const { data: pgcr, loadingState: pgcrLoadingState } = usePGCR({ activityId, errorHandler })
    return (
        <>
            <Head>
                <title key="title">
                    {pgcr?.raid ? `${Short[pgcr.raid]} ${activityId} | RaidHub` : "RaidHub"}
                </title>
            </Head>
            <main className={styles["main"]} id={"screenshot-container"}>
                <section className={styles["summary-card"]}>
                    {typeof pgcr?.raid === "number" && (
                        <Image
                            priority
                            className={[
                                styles["summary-card-background"],
                                pgcr?.completed ?? true ? "" : styles["summary-card-dnf"]
                            ].join(" ")}
                            src={RaidCardBackground[pgcr.raid]}
                            alt="background image"
                            fill
                            style={{ opacity: BackdropOpacity[pgcr?.raid ?? Raid.NA] }}
                        />
                    )}
                    <ActivityHeader activity={pgcr} pgcrLoadingState={pgcrLoadingState} />
                    <ParticipantsSection
                        completed={pgcr?.completed ?? true}
                        players={pgcr?.players ?? []}
                        pgcrLoadingState={pgcrLoadingState}
                    />
                </section>
                <section className={styles["summary-stats"]}>
                    <SummaryStatsGrid activity={pgcr} />
                </section>
            </main>
        </>
    )
}

export default PGCR
