import styles from "~/styles/pages/pgcr.module.css"
import ParticipantsSection from "./participants/ParticipantsSection"
import SummaryStatsGrid from "./SummaryStatsGrid"
import ActivityHeader from "./participants/ActivityHeader"
import KebabMenu from "../reusable/KebabMenu"
import ScreenshotContainer from "../reusable/ScreenshotContainer"
import RaidCardBackground from "~/images/raid-backgrounds"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { usePGCRContext } from "~/pages/pgcr/[activityId]"
import { createRef } from "react"
import { BackdropOpacity } from "~/util/destiny/raidUtils"
import { Raid } from "~/types/raids"
import CloudflareImage from "~/images/CloudflareImage"
import PGCRSettingsMenu, { PGCRSettings } from "./menu/PGCRSettingsMenu"

const defaultPrefs = {
    showScore: false
}

const PGCR = () => {
    const { data: pgcr } = usePGCRContext()
    const summaryCardRef = createRef<HTMLElement>()
    const { value: prefs, save: savePrefs } = useLocalStorage<PGCRSettings>(
        "pgcr_prefs",
        defaultPrefs
    )

    return (
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
                        <CloudflareImage
                            priority
                            className={[
                                styles["summary-card-background"],
                                pgcr?.completed ?? true ? "" : styles["summary-card-dnf"]
                            ].join(" ")}
                            cloudflareId={RaidCardBackground[pgcr.raid]}
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
    )
}

export default PGCR
