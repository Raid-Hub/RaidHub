"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef } from "react"
import { useRaidCardContext } from "~/app/(profile)/raids/RaidCardContext"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
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
    const { sunsetRaids, getRaidString } = useRaidHubManifest()

    const { activities, isLoadingActivities } = useRaidCardContext()

    const recents = useMemo(
        () =>
            Array.from(activities?.values() ?? [])
                .filter(a => a.completed)
                .slice(0, 24),
        [activities]
    )

    const scrollTargetRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollTargetRef.current) {
            scrollTargetRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [])

    return (
        <div className={styles["expanded-raid"]} ref={scrollTargetRef}>
            <button onClick={dismiss}>close</button>
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
                    <h3>Stats</h3>
                    {<ExpandedStatsTable />}

                    {!includedIn(sunsetRaids, raid) && (
                        <div>
                            <h3>Weekly Progress</h3>
                            <WeeklyProgress raid={raid} />
                        </div>
                    )}
                </div>
                <div className={styles.history}>
                    <h3>Recent Completions</h3>
                    {!isLoadingActivities && (
                        <div className={styles["history-activities"]}>
                            {recents?.map(
                                () => null
                                // todo
                                // <ActivityTile key={a.instanceId} activity={a} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
