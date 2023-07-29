import styles from "../../../styles/pages/profile/mid.module.css"
import { useEffect, useMemo, useState } from "react"
import { secondsToHMS } from "../../../util/presentation/formatting"
import { raidTupleFromHash, raidVersion } from "../../../util/destiny/raid"
import { useLocale } from "../../app/LanguageProvider"
import { TransitoryActivity } from "../../../hooks/bungie/useProfileTransitory"
import Link from "next/link"

type CurrentActivityParams = {
    data: TransitoryActivity
    lastRefresh: Date
}

const CurrentActivity = ({
    data: { transitory, activityDefinition, activityModeDefinition, partyMembers },
    lastRefresh
}: CurrentActivityParams) => {
    const { strings } = useLocale()

    const raidTuple = useMemo(() => {
        try {
            return raidTupleFromHash(activityDefinition.hash?.toString() ?? "")
        } catch {
            return null
        }
    }, [activityDefinition.hash])

    const activityName = useMemo(() => {
        if (raidTuple && transitory.currentActivity.startTime) {
            return (
                raidVersion(
                    raidTuple,
                    new Date(transitory.currentActivity.startTime),
                    new Date(),
                    strings,
                    false
                ) + strings.raidNames[raidTuple[0]]
            )
        } else if (activityDefinition && activityModeDefinition) {
            return (
                activityModeDefinition.displayProperties.name +
                ": " +
                activityDefinition.displayProperties.name
            )
        } else if (activityDefinition) {
            return activityDefinition.displayProperties.name
        } else {
            return null
        }
    }, [transitory.currentActivity, activityDefinition, activityModeDefinition, raidTuple, strings])

    return activityName ? (
        <div className={styles["current-activity"]}>
            <div>
                <span className={styles["current-activity-label"]}>{strings.inGame}</span>
                <span className={styles["activity-name"]}>{activityName}</span>
            </div>
            <div>
                <span className={styles["current-activity-label"]}>{strings.fireteam}</span>
                <div className={styles["fireteam-members"]}>
                    {partyMembers.map(
                        ({
                            bungieGlobalDisplayName,
                            displayName,
                            membershipId,
                            membershipType
                        }) => (
                            <Link
                                href={`/profile/${membershipType}/${membershipId}`}
                                key={membershipId}>
                                {bungieGlobalDisplayName ?? displayName}
                            </Link>
                        )
                    )}
                </div>
            </div>
            {transitory.currentActivity.startTime && (
                <div className={styles["timer-container"]}>
                    <span className={styles["current-activity-label"]}>{strings.elapsedTime}</span>
                    <Timer
                        lastRefresh={lastRefresh}
                        startTime={new Date(transitory.currentActivity.startTime)}
                    />
                </div>
            )}
        </div>
    ) : null
}

function Timer({ lastRefresh, startTime }: { lastRefresh: Date; startTime: Date }) {
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setSeconds(seconds => seconds + 1)
        }, 1000)

        return () => {
            setSeconds(0)
            clearInterval(id)
        }
    }, [lastRefresh])

    const secondsSinceStart = useMemo(
        () => Math.round((lastRefresh.getTime() - startTime.getTime()) / 1000),
        [lastRefresh, startTime]
    )

    const elapsed = seconds + secondsSinceStart

    return <div className={styles["timer"]}>{secondsToHMS(elapsed, true)}</div>
}

export default CurrentActivity
