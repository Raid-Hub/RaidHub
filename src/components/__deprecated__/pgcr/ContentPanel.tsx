"use client"

import Image from "next/image"
import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { CloudflareImage } from "~/components/CloudflareImage"
import RaidCardBackground from "~/data/raid-backgrounds"
import { useActivityDefinition } from "~/hooks/dexie"
import { bungiePgcrImageUrl } from "~/util/destiny"
import KebabMenu from "../reusable/KebabMenu"
import PGCRSettingsMenu from "./menu/PGCRSettingsMenu"
import ActivityHeader from "./participants/ActivityHeader"
import ParticipantsSection from "./participants/ParticipantsSection"
import styles from "./pgcr.module.css"

/** @deprecated */
export const PGCRContentPanel = () => {
    const { hash, raid, completed } = usePGCRContext()
    const manifestDef = useActivityDefinition(hash ?? 0)

    return (
        <section className={styles["summary-card"]}>
            {typeof raid === "number" && (
                <CloudflareImage
                    cloudflareId={RaidCardBackground[raid]}
                    priority
                    className={[
                        styles["summary-card-background"],
                        completed ? "" : styles["summary-card-dnf"]
                    ].join(" ")}
                    alt="background image"
                    fill
                    style={{ opacity: 0.85 }}
                />
            )}
            {raid === null && (
                <Image
                    src={bungiePgcrImageUrl(manifestDef?.pgcrImage)}
                    priority
                    unoptimized
                    className={[
                        styles["summary-card-background"],
                        completed ?? true ? "" : styles["summary-card-dnf"]
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
