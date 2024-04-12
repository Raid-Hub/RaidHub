"use client"

import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { CloudflareImage } from "~/components/CloudflareImage"
import RaidCardBackground from "~/data/raid-backgrounds"
import KebabMenu from "../reusable/KebabMenu"
import PGCRSettingsMenu from "./menu/PGCRSettingsMenu"
import ActivityHeader from "./participants/ActivityHeader"
import ParticipantsSection from "./participants/ParticipantsSection"
import styles from "./pgcr.module.css"

/** @deprecated */
export const PGCRContentPanel = () => {
    const { data } = usePGCRContext()

    return (
        <section className={styles["summary-card"]}>
            {typeof data?.meta.activityId === "number" && (
                <CloudflareImage
                    cloudflareId={RaidCardBackground[data.meta.activityId]}
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
            <div className={styles["settings-menu-container"]}>
                <KebabMenu size={20} alignmentSide="right">
                    <PGCRSettingsMenu />
                </KebabMenu>
            </div>
            <ActivityHeader />
            <ParticipantsSection />
        </section>
    )
}
