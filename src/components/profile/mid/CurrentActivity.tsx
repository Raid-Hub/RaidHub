import {
    DestinyCharacterActivitiesComponent,
    DestinyProfileTransitoryComponent,
    DestinyProfileTransitoryPartyMember
} from "bungie-net-core/models"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useBungieClient } from "~/components/app/TokenManager"
import { useActivityDefiition } from "~/hooks/dexie/useActivityDefinition"
import { useActivityModeDefinition } from "~/hooks/dexie/useActivityModeDefinition"
import { isPrimaryCrossSave } from "~/util/destiny/crossSave"
import styles from "../../../styles/pages/profile/mid.module.css"
import { secondsToHMS } from "../../../util/presentation/formatting"
import { useProfileProps } from "../Profile"

export default function CurrentActivity() {
    const bungie = useBungieClient()
    const { destinyMembershipId, destinyMembershipType } = useProfileProps()
    const { data, dataUpdatedAt: updatedAt } = bungie.profileTransitory.useQuery(
        {
            destinyMembershipId,
            membershipType: destinyMembershipType
        },
        {
            refetchInterval: 60000,
            refetchIntervalInBackground: false,
            refetchOnReconnect: true,
            refetchOnWindowFocus: true
        }
    )

    const activities = Object.values(data?.characterActivities.data ?? {}).sort(
        (a, b) =>
            new Date(b.dateActivityStarted).getTime() - new Date(a.dateActivityStarted).getTime()
    )[0] as DestinyCharacterActivitiesComponent | undefined

    return data?.profileTransitoryData.data?.currentActivity && activities ? (
        <CurrentActivityExisting
            transitoryComponent={data.profileTransitoryData.data}
            updatedAt={updatedAt}
            activitiesComponent={activities}
        />
    ) : null
}

function CurrentActivityExisting({
    transitoryComponent,
    activitiesComponent,
    updatedAt
}: {
    transitoryComponent: DestinyProfileTransitoryComponent
    activitiesComponent: DestinyCharacterActivitiesComponent
    updatedAt: number
}) {
    const activity = useActivityDefiition(activitiesComponent.currentActivityHash)
    const activityMode = useActivityModeDefinition(activitiesComponent.currentActivityModeHash)

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

    return transitoryComponent?.currentActivity ? (
        <Link
            href={{
                pathname: "/guardians",
                query: {
                    membershipId: transitoryComponent.partyMembers.map(pm => pm.membershipId)
                }
            }}
            className={styles["current-activity"]}>
            <div>
                <span className={styles["current-activity-label"]}>In Game</span>
                <span className={styles["activity-name"]}>{activityName}</span>
            </div>
            <div>
                <span className={styles["current-activity-label"]}>Fireteam</span>
                <div className={styles["fireteam-members"]}>
                    {transitoryComponent.partyMembers.map(pm => (
                        <PartyMember key={pm.membershipId} {...pm} />
                    ))}
                </div>
            </div>
            {transitoryComponent.currentActivity.startTime && (
                <div className={styles["timer-container"]}>
                    <span className={styles["current-activity-label"]}>Elapsed Time</span>
                    <Timer
                        lastRefresh={updatedAt}
                        startTime={new Date(transitoryComponent.currentActivity.startTime)}
                    />
                </div>
            )}
        </Link>
    ) : null
}

function PartyMember({ membershipId }: DestinyProfileTransitoryPartyMember) {
    const bungie = useBungieClient()
    const { data } = bungie.linkedProfiles.useQuery({ membershipId }, { staleTime: Infinity })
    const primaryProfile = data
        ? data.profiles.find(p => isPrimaryCrossSave(p, membershipId))!
        : null

    return (
        <span>
            {(primaryProfile?.bungieGlobalDisplayName ?? primaryProfile?.displayName) ||
                membershipId}
        </span>
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
