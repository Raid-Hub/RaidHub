import styles from "@/styles/pages/pgcr.module.css"
import Head from "next/head"
import Image from "next/image"
import ParticipantsSection from "./ParticipantsSection"
import SummaryStatsGrid from "./SummaryStatsGrid"
import ActivityHeader from "./ActivityHeader"
import KebabMenu from "../reusable/KebabMenu"
import ScreenshotContainer from "../reusable/ScreenshotContainer"
import RaidCardBackground from "@/images/raid-backgrounds"
import PGCRSettingsMenu, { PGCRSettings } from "./PGCRSettingsMenu"
import { BackdropOpacity, Raid, Short } from "@/types/raids"
import { useLocalStorage } from "@/hooks/util/useLocalStorage"
import { usePGCRContext } from "@/pages/pgcr/[activityId]"
import { createRef } from "react"

const defaultPrefs = {
    showScore: false
}

const PGCR = () => {
    const { pgcr } = usePGCRContext()
    const summaryCardRef = createRef<HTMLElement>()
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
                <ScreenshotContainer
                    childRef={summaryCardRef}
                    options={{
                        backgroundColor: null,
                        scale: 5,
                        useCORS: true
                    }}>
                    <section className={styles["summary-card"]} ref={summaryCardRef}>
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
                        <div
                            className={styles["settings-menu-container"]}
                            data-html2canvas-ignore={true}>
                            <KebabMenu size={20} alignmentSide="right">
                                <PGCRSettingsMenu value={prefs} save={savePrefs} />
                            </KebabMenu>
                        </div>
                        <ActivityHeader />
                        <ParticipantsSection showScorePref={prefs?.showScore ?? false} />
                    </section>
                </ScreenshotContainer>
                <SummaryStatsGrid />
            </main>
        </>
    )
}

export default PGCR
