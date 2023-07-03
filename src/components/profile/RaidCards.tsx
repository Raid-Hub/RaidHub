import { BungieMembershipType, DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/models"
import { useActivityHistory } from "../../hooks/bungie/useActivityHistory"
import styles from "../../styles/profile.module.css"
import { LocalizedStrings } from "../../util/presentation/localized-strings"
import { AllRaids, Raid, raidDetailsFromHash } from "../../util/destiny/raid"
import RaidModal from "./RaidModal"
import ActivityCard from "./ActivityCard"
import { useEffect, useState } from "react"
import Loading from "../global/Loading"
import { usePrefs } from "../../hooks/util/usePrefs"
import { DefaultPreferences, Prefs } from "../../util/profile/preferences"
import { AllRaidStats, RaidHubProfile } from "../../types/profile"
import { ErrorHandler } from "../../types/generic"
import { useLocale } from "../app/LanguageProvider"

const CARDS_PER_PAGE = 60

export enum Layout {
    DotCharts,
    RecentActivities
}

type RaidCardsProps = {
    profile: RaidHubProfile | null
    membershipId: string
    membershipType: BungieMembershipType
    characterIds: string[] | null
    layout: Layout
    raidMetrics: AllRaidStats | null
    isLoadingRaidMetrics: boolean
    errorHandler: ErrorHandler
}

const RaidCards = ({
    profile,
    membershipId: destinyMembershipId,
    membershipType,
    characterIds,
    layout,
    raidMetrics,
    isLoadingRaidMetrics,
    errorHandler
}: RaidCardsProps) => {
    const { strings } = useLocale()
    const { prefs, isLoading: isLoadingPrefs } = usePrefs(destinyMembershipId, [Prefs.FILTER])
    const { activities, isLoading: isLoadingDots } = useActivityHistory({
        destinyMembershipId,
        membershipType,
        characterIds,
        errorHandler
    })
    const [allActivities, setAllActivities] = useState<DestinyHistoricalStatsPeriodGroup[]>([])
    const [activitiesByRaid, setActivitiesByRaid] = useState<Record<
        Raid,
        DestinyHistoricalStatsPeriodGroup[]
    > | null>(null)
    const [pages, setPages] = useState<number>(1)

    useEffect(() => {
        if (!activities) return

        setAllActivities(
            Object.values(activities)
                .flatMap(set => set.toJSON())
                .filter(!isLoadingPrefs ? prefs![Prefs.FILTER] : DefaultPreferences[Prefs.FILTER])
                .sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())
        )

        setActivitiesByRaid(
            Object.fromEntries(
                AllRaids.map(raid => [
                    raid,
                    activities[raid]
                        .toJSON()
                        .filter(
                            !isLoadingPrefs
                                ? prefs![Prefs.FILTER]
                                : DefaultPreferences[Prefs.FILTER]
                        )
                        .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
                ])
            ) as Record<Raid, DestinyHistoricalStatsPeriodGroup[]>
        )
    }, [activities, isLoadingDots, isLoadingPrefs, prefs])

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {AllRaids.map((raid, idx) => (
                        <RaidModal
                            membershipId={destinyMembershipId}
                            stats={raidMetrics?.get(raid)}
                            isLoadingStats={isLoadingRaidMetrics}
                            key={idx}
                            raidName={strings.raidNames[raid]}
                            raid={raid}
                            activities={activitiesByRaid ? activitiesByRaid![raid] : []}
                            isLoadingDots={isLoadingDots || !activitiesByRaid}
                            placement={profile?.placements[raid]}
                            tags={profile?.tags[raid]}
                        />
                    ))}
                </div>
            )
        case Layout.RecentActivities:
            return (
                <div className={styles["recent"]}>
                    {allActivities
                        .slice(0, pages * CARDS_PER_PAGE)
                        .map(({ activityDetails, values, period }, key) => (
                            <ActivityCard
                                key={key}
                                info={raidDetailsFromHash(activityDetails.referenceId.toString())}
                                strings={strings}
                                completed={!!values.completed.basic.value}
                                activityId={activityDetails.instanceId}
                                completionDate={new Date(period)}
                            />
                        ))}
                    {!isLoadingDots ? (
                        allActivities.length > pages * CARDS_PER_PAGE ? (
                            <button
                                className={styles["load-more"]}
                                onClick={() => setPages(pages + 1)}>
                                <span>{strings.loadMore}</span>
                            </button>
                        ) : (
                            <></>
                        )
                    ) : (
                        Array(CARDS_PER_PAGE)
                            .fill(null)
                            .map((_, key) => (
                                <div className={styles["placeholder"]} key={key}>
                                    <Loading />
                                </div>
                            ))
                    )}
                </div>
            )
    }
}

export default RaidCards
