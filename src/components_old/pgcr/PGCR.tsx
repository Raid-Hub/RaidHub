import { QueryObserverLoadingResult, QueryObserverSuccessResult } from "@tanstack/react-query"
import { createContext, createRef, useContext } from "react"
import RaidCardBackground from "~/data/raid-backgrounds"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import CloudflareImage from "~/images/CloudflareImage"
import styles from "~/styles/pages/pgcr.module.css"
import DestinyPGCR from "~/util/destiny/PGCR"
import { useBungieClient } from "../../app/managers/BungieTokenManager"
import KebabMenu from "../reusable/KebabMenu"
import ScreenshotContainer from "../reusable/ScreenshotContainer"
import SummaryStatsGrid from "./SummaryStatsGrid"
import PGCRSettingsMenu, { PGCRSettings } from "./menu/PGCRSettingsMenu"
import ActivityHeader from "./participants/ActivityHeader"
import ParticipantsSection from "./participants/ParticipantsSection"

const PgcrContext = createContext<
    | ((QueryObserverSuccessResult<DestinyPGCR> | QueryObserverLoadingResult<DestinyPGCR>) & {
          activityId: string
      })
    | null
>(null)

export const usePGCRContext = () => {
    const ctx = useContext(PgcrContext)
    if (!ctx) throw new Error("Cannot access pgcr out of context")
    return ctx
}

const defaultPrefs = {
    showScore: false
}

const PGCR = ({ activityId }: { activityId: string }) => {
    const bungie = useBungieClient()
    const query = bungie.pgcr.useQuery({ activityId }, { staleTime: Infinity })

    const [prefs, savePrefs] = useLocalStorage<PGCRSettings>("pgcr_prefs", defaultPrefs)

    const summaryCardRef = createRef<HTMLElement>()

    if (query.isError) {
        return <div>Something Went wrong.</div>
    }

    const pgcr = query.data
    return (
        <PgcrContext.Provider value={{ activityId, ...query }}>
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
                                style={{ opacity: 0.85 }}
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
        </PgcrContext.Provider>
    )
}

export default PGCR
