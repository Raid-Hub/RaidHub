import styles from "../../../styles/pages/profile/mid.module.css"
import { useEffect, useMemo, useState } from "react"
import { secondsToHMS } from "../../../util/presentation/formatting"
import { useLocale } from "../../app/LocaleManager"
import Link from "next/link"
import {
    DestinyCharacterActivitiesComponent,
    DestinyProfileTransitoryComponent,
    DestinyProfileTransitoryPartyMember
} from "bungie-net-core/models"
import { useBungieClient } from "~/components/app/TokenManager"
import { isPrimaryCrossSave } from "~/util/destiny/crossSave"
import { useActivity, useActivityMode } from "~/components/app/DestinyManifestManager"
import Loading from "~/components/global/Loading"

type CurrentActivityParams = {
    transitoryComponent: DestinyProfileTransitoryComponent
    activitiesComponent: DestinyCharacterActivitiesComponent
    profileUpdatedAt: number
}

const CurrentActivity = ({
    transitoryComponent,
    activitiesComponent,
    profileUpdatedAt
}: CurrentActivityParams) => {
    const { data: activity, isLoading: isLoadingActivity } = useActivity(
        activitiesComponent.currentActivityHash
    )
    const { data: activityMode, isLoading: isLoadingActivityMode } = useActivityMode(
        activitiesComponent.currentActivityModeHash
    )

    const activityName = useMemo(() => {
        const activityName = activity?.displayProperties.name
        const activityModeName = activityMode?.displayProperties.name
        if (activity?.hash === 82913930) {
            return "Orbit"
        } else if (activityName && activityModeName) {
            return activityModeName + ": " + activityName
        } else if (activityName) {
            return activityName
        } else {
            return null
        }
    }, [activity, activityMode])

    const { strings } = useLocale()

    if (isLoadingActivityMode || isLoadingActivity) {
        return <Loading className={styles["current-activity"]} />
    }

    return (
        <Link
            href={{
                pathname: "/inspect",
                query: {
                    members: transitoryComponent.partyMembers.map(pm => pm.membershipId).join(", ")
                }
            }}
            className={styles["current-activity"]}>
            <div>
                <span className={styles["current-activity-label"]}>{strings.inGame}</span>
                <span className={styles["activity-name"]}>{activityName}</span>
            </div>
            <div>
                <span className={styles["current-activity-label"]}>{strings.fireteam}</span>
                <div className={styles["fireteam-members"]}>
                    {transitoryComponent.partyMembers.map(pm => (
                        <PartyMember key={pm.membershipId} {...pm} />
                    ))}
                </div>
            </div>
            {transitoryComponent.currentActivity.startTime && (
                <div className={styles["timer-container"]}>
                    <span className={styles["current-activity-label"]}>{strings.elapsedTime}</span>
                    <Timer
                        lastRefresh={profileUpdatedAt}
                        startTime={new Date(transitoryComponent.currentActivity.startTime)}
                    />
                </div>
            )}
        </Link>
    )
}

function PartyMember({ membershipId }: DestinyProfileTransitoryPartyMember) {
    const bungie = useBungieClient()
    const { data } = bungie.linkedProfiles.useQuery({ membershipId }, { staleTime: Infinity })
    const primaryProfile = data ? data.profiles.find(isPrimaryCrossSave)! : null

    return primaryProfile ? (
        <Link href={`/profile/${primaryProfile.membershipType}/${primaryProfile.membershipId}`}>
            {primaryProfile.bungieGlobalDisplayName ?? primaryProfile.displayName}
        </Link>
    ) : (
        <span>{membershipId}</span>
    )
}

function Timer({ lastRefresh, startTime }: { lastRefresh: number; startTime: Date }) {
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
        () => Math.round((lastRefresh - startTime.getTime()) / 1000),
        [lastRefresh, startTime]
    )

    const elapsed = seconds + secondsSinceStart

    return <div className={styles["timer"]}>{secondsToHMS(elapsed, true)}</div>
}

export default CurrentActivity
