"use client"

import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { CloudflareImage } from "~/components/CloudflareImage"
import { getRaidSplash } from "~/data/activity-images"
import ActivityHeader from "./participants/ActivityHeader"
import ParticipantsSection from "./participants/ParticipantsSection"
import styles from "./pgcr.module.css"

/** @deprecated */
export const PGCRContentPanel = () => {
    const { data } = usePGCRContext()

    return (
        <section className={styles["summary-card"]}>
            {typeof data?.activityId === "number" && (
                <CloudflareImage
                    cloudflareId={getRaidSplash(data.activityId) ?? "pantheonSplash"}
                    priority
                    className={[
                        styles["summary-card-background"],
                        data.completed ? "" : styles["summary-card-dnf"]
                    ].join(" ")}
                    alt="background image"
                    fill
                    style={{ opacity: 0.85 }}
                />
            )}
            {/* <div className={styles["settings-menu-container"]}>
                <KebabMenu size={20} alignmentSide="right">
                    <PGCRSettingsMenu />
                </KebabMenu>
            </div> */}
            <ActivityHeader />
            <ParticipantsSection />
        </section>
    )
}
