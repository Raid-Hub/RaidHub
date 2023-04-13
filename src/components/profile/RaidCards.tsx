import { BungieMembershipType, DestinyHistoricalStatsPeriodGroup } from "oodestiny/schemas"
import { useActivityHistory } from "../../hooks/activityHistory"
import { useLanguage } from "../../hooks/language"
import styles from "../../styles/profile.module.css"
import { LocalizedStrings } from "../../util/localized-strings"
import { AllRaids, Raid, raidDetailsFromHash } from "../../util/raid"
import RaidCard from "./RaidCard"
import ActivityCard from "./ActivityCard"
import { useEffect, useState } from "react"
import Loading from "../Loading"
import { usePrefs } from "../../hooks/prefs"
import { DefaultPreferences, Prefs } from "../../util/preferences"

const CARDS_PER_PAGE = 60

export enum Layout {
    DotCharts,
    RecentActivities
}

type RaidCardsProps = {
    membershipId: string
    membershipType: BungieMembershipType
    characterIds: string[]
    layout: Layout
}

const RaidCards = ({ membershipId, membershipType, characterIds, layout }: RaidCardsProps) => {
    const language = useLanguage()
    const { prefs, isLoading: isLoadingPrefs } = usePrefs(membershipId, [Prefs.FILTER])
    const { activities, isLoading: isLoadingDots } = useActivityHistory({
        membershipId,
        membershipType,
        characterIds
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
    }, [isLoadingDots, prefs])

    const strings = LocalizedStrings[language]

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {AllRaids.map((raid, idx) => (
                        <RaidCard
                            stats={{
                                totalClears: 0,
                                fastestClear: 0,
                                averageClear: 0,
                                sherpas: 0
                            }}
                            key={idx}
                            raidName={strings.raidNames[raid]}
                            raid={raid}
                            activities={activitiesByRaid ? activitiesByRaid![raid] : []}
                            isLoadingDots={isLoadingDots || !activitiesByRaid}
                        />
                    ))}
                </div>
            )
        case Layout.RecentActivities:
            return (
                <div className={styles["recent"]}>
                    {allActivities.slice(0, pages * CARDS_PER_PAGE).map(activity => (
                        <ActivityCard
                            info={raidDetailsFromHash(
                                activity.activityDetails.referenceId.toString()
                            )}
                            strings={strings}
                            completed={!!activity.values.completed.basic.value}
                            activityId={activity.activityDetails.instanceId}
                            completionDate={new Date(activity.period)}
                        />
                    ))}
                    {!isLoadingDots ? (
                        allActivities.length > pages * CARDS_PER_PAGE ? (
                            <button
                                className={styles["load-more"]}
                                onClick={() => setPages(pages + 1)}
                            >
                                <span>{strings.loadMore}</span>
                            </button>
                        ) : (
                            <></>
                        )
                    ) : (
                        Array(CARDS_PER_PAGE)
                            .fill(null)
                            .map((_, idx) => (
                                <div className={styles["placeholder"]} key={idx}>
                                    <Loading />
                                </div>
                            ))
                    )}
                </div>
            )
    }
}

export default RaidCards
