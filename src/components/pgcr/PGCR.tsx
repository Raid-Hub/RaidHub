import styles from "~/styles/pages/pgcr.module.css"
import ParticipantsSection from "./participants/ParticipantsSection"
import SummaryStatsGrid from "./SummaryStatsGrid"
import ActivityHeader from "./participants/ActivityHeader"
import KebabMenu from "../reusable/KebabMenu"
import ScreenshotContainer from "../reusable/ScreenshotContainer"
import RaidCardBackground from "~/images/raid-backgrounds"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { createContext, createRef, useContext } from "react"
import { BackdropOpacity } from "~/util/destiny/raidUtils"
import { Raid } from "~/types/raids"
import CloudflareImage from "~/images/CloudflareImage"
import PGCRSettingsMenu, { PGCRSettings } from "./menu/PGCRSettingsMenu"
import { useBungieClient } from "../app/TokenManager"
import { QueryObserverLoadingResult, QueryObserverSuccessResult } from "@tanstack/react-query"
import DestinyPGCR from "~/models/pgcr/PGCR"
import ErrorComponent from "../global/Error"
import CustomError, { ErrorCode } from "~/models/errors/CustomError"

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
        return <ErrorComponent error={CustomError.handle(query.error, ErrorCode.PGCR)} />
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
        </PgcrContext.Provider>
    )
}

export default PGCR
