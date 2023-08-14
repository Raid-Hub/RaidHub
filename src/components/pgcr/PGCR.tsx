import styles from "../../styles/pages/pgcr.module.css"
import Head from "next/head"
import { BackdropOpacity, Raid, Short } from "../../types/raids"
import ActivityHeader from "./ActivityHeader"
import ParticipantsSection from "./ParticipantsSection"
import SummaryStatsGrid from "./SummaryStatsGrid"
import RaidCardBackground from "../../images/raid-backgrounds"
import Image from "next/image"
import KebabMenu from "../reusable/KebabMenu"
import PGCRSettingsMenu, { PGCRSettings } from "./PGCRSettingsMenu"
import { useLocalStorage } from "../../hooks/util/useLocalStorage"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"

const defaultPrefs = {
    showScore: false
}

const PGCR = () => {
    const { pgcr } = usePGCRContext()
    const { value: prefs, save: savePrefs } = useLocalStorage<PGCRSettings>(
        "pgcr_prefs",
        defaultPrefs
    )

    return (
        <>
            <Head>
                <title key="title">
                    {pgcr?.raid
                        ? `${Short[pgcr.raid]} ${pgcr.activityDetails.instanceId} | RaidHub`
                        : "RaidHub"}
                </title>
            </Head>
            <main className={styles["main"]}>
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
                    <div className={styles["settings-menu-container"]}>
                        <KebabMenu size={20} alignmentSide="right">
                            <PGCRSettingsMenu value={prefs} save={savePrefs} />
                        </KebabMenu>
                    </div>
                    <ActivityHeader />
                    <ParticipantsSection showScorePref={prefs?.showScore ?? false} />
                </section>
                <section className={styles["summary-stats"]}>
                    <SummaryStatsGrid />
                </section>
            </main>
        </>
    )
}

export default PGCR
