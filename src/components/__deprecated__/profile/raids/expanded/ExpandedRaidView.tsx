"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useRaidCardContext } from "~/app/(profile)/raids/RaidCardContext"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { useDialog } from "~/components/Dialog"
import { usePortal } from "~/components/Portal"
import { useClickOutside } from "~/hooks/util/useClickOutside"
import type { ListedRaid } from "~/services/raidhub/types"
import { includedIn } from "~/util/helpers"
import ExpandedStatsTable from "./ExpandedStatsTable"
import WeeklyProgress from "./WeeklyProgress"
import styles from "./expanded-raid.module.css"

/**@deprecated */
export default function ExpandedRaidView({
    raid,
    dismiss
}: {
    raid: ListedRaid
    dismiss: () => void
}) {
    const { Dialog, close, ref } = useDialog()
    const portal = usePortal()
    const { sunsetRaids, getRaidString } = useRaidHubManifest()
    const { activities, isLoadingActivities } = useRaidCardContext()

    const recents = useMemo(
        () =>
            Array.from(activities?.values() ?? [])
                .filter(a => a.completed)
                .slice(0, 24),
        [activities]
    )

    useClickOutside(ref, dismiss, {
        enabled: true,
        lockout: 50
    })

    return portal(
        <Dialog data-newo-id="newoewew" className={styles["expanded-raid"]} onClose={dismiss} open>
            <p>
                This view is still a work in progress. <b>Have an idea or suggestion?</b> Join our
                discord:{" "}
                <Link
                    href="https://discord.gg/raidhub"
                    style={{ color: "var(--brand-orange-light)" }}
                    target="_blank">
                    discord.gg/raidhub
                </Link>
            </p>
            <h2>Expanded details for {getRaidString(raid)}</h2>
            <div className={styles.container}>
                <div className={styles["bungie-stats"]}>
                    {!includedIn(sunsetRaids, raid) && (
                        <div>
                            <h3>Weekly Progress</h3>
                            <WeeklyProgress raid={raid} />
                        </div>
                    )}
                    <h3>Stats</h3>
                    <ExpandedStatsTable />
                </div>
                {/* // todo */}
                {/* <div className={styles.history}>
                    <h3>Recent Completions</h3>
                    {!isLoadingActivities && (
                        <div className={styles["history-activities"]}>
                            {recents?.map(
                                () => null
                                
                                // <ActivityTile key={a.instanceId} activity={a} />
                            )}
                        </div>
                    )}
                </div> */}
            </div>
        </Dialog>
    )
}
