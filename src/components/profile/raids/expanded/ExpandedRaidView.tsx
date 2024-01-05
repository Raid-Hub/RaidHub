import { ListedRaid, SunsetRaids } from "~/types/raids"
import styles from "./expanded-raid.module.css"
import { useLocale } from "~/components/app/LocaleManager"
import Link from "next/link"
import WeeklyProgress from "./WeeklyProgress"
import { includedIn } from "~/util/betterIncludes"
import ActivityTile from "../ActivityTile"
import { useEffect, useMemo, useRef } from "react"
import ExpandedStatsTable from "./ExpandedStatsTable"
import { useActivitiesContext } from "../RaidContext"

export default function ExpandedRaidView({
    raid,
    dismiss
}: {
    raid: ListedRaid
    dismiss: () => void
}) {
    const { strings } = useLocale()

    const { activities, isLoadingActivities } = useActivitiesContext()

    const recents = useMemo(
        () =>
            activities
                ?.toJSON()
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
            <h2>Expanded details for {strings.raidNames[raid]}</h2>
            <div className={styles["container"]}>
                <div className={styles["bungie-stats"]}>
                    <h3>Stats</h3>
                    {<ExpandedStatsTable />}

                    {!includedIn(SunsetRaids, raid) && (
                        <div>
                            <h3>Weekly Progress</h3>
                            <WeeklyProgress raid={raid} />
                        </div>
                    )}
                </div>
                <div className={styles["history"]}>
                    <h3>Recent Completions</h3>
                    {!isLoadingActivities && (
                        <div className={styles["history-activities"]}>
                            {recents?.map(a => (
                                <ActivityTile key={a.activityId} activity={a} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
