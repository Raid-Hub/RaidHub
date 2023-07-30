import styles from "../../../styles/pages/profile/mid.module.css"
import { useEffect, useMemo, useState } from "react"
import { secondsToHMS } from "../../../util/presentation/formatting"
import { raidTupleFromHash, raidVersion } from "../../../util/destiny/raid"
import { useLocale } from "../../app/LocaleManager"
import Link from "next/link"
import { useProfileTransitory } from "../../../hooks/bungie/useProfileTransitory"
import { ErrorHandler } from "../../../types/generic"
import { BungieMembershipType } from "bungie-net-core/lib/models"

type CurrentActivityParams = {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

const CurrentActivity = ({
    destinyMembershipId,
    destinyMembershipType,
    errorHandler
}: CurrentActivityParams) => {
    const { strings } = useLocale()
    const {
        profile,
        isLoading: isLoadingTransitoryProfile,
        lastRefresh: lastTransitoryRefresh
    } = useProfileTransitory({
        destinyMembershipId,
        destinyMembershipType,
        errorHandler
    })

    const raidTuple = useMemo(() => {
        try {
            return raidTupleFromHash(profile?.activityDefinition.hash?.toString() ?? "")
        } catch {
            return null
        }
    }, [profile?.activityDefinition.hash])

    const activityName = useMemo(() => {
        if (raidTuple && profile?.transitory.currentActivity.startTime) {
            return (
                raidVersion(
                    raidTuple,
                    new Date(profile.transitory.currentActivity.startTime),
                    new Date(),
                    strings,
                    false
                ) + strings.raidNames[raidTuple[0]]
            )
        } else if (profile?.activityDefinition && profile.activityModeDefinition) {
            return (
                profile.activityModeDefinition.displayProperties.name +
                ": " +
                profile.activityDefinition.displayProperties.name
            )
        } else if (profile?.activityDefinition) {
            return profile?.activityDefinition.displayProperties.name
        } else {
            return null
        }
    }, [profile, raidTuple, strings])

    return profile ? (
        <div className={styles["current-activity"]}>
            <div>
                <span className={styles["current-activity-label"]}>{strings.inGame}</span>
                <span className={styles["activity-name"]}>{activityName}</span>
            </div>
            <div>
                <span className={styles["current-activity-label"]}>{strings.fireteam}</span>
                <div className={styles["fireteam-members"]}>
                    {profile.partyMembers.map(
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
            {profile.transitory.currentActivity.startTime && (
                <div className={styles["timer-container"]}>
                    <span className={styles["current-activity-label"]}>{strings.elapsedTime}</span>
                    <Timer
                        lastRefresh={lastTransitoryRefresh}
                        startTime={new Date(profile.transitory.currentActivity.startTime)}
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
