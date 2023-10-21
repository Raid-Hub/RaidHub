import styles from "~/styles/pages/profile/raids.module.css"
import { ListedRaids } from "~/types/raids"
import RaidCard from "./RaidCard"
import { useEffect, useMemo } from "react"
import RecentRaids from "./RecentRaids"
import { Layout } from "../mid/LayoutToggle"
import { useBungieClient } from "~/components/app/TokenManager"
import { BungieMembershipType } from "bungie-net-core/models"
import { Collection } from "@discordjs/collection"
import { partitionCollectionByRaid } from "~/util/destiny/partitionCollectionByRaid"
import { partitionStatsByRaid } from "~/util/destiny/partitionStatsByRaid"
import RaidStats from "~/models/profile/data/RaidStats"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { useQueryParamState } from "~/hooks/util/useQueryParamState"
import { zRaidURIComponent } from "~/util/zod"
import ExpandedRaidView from "./expanded/ExpandedRaidView"
import { useRaidHubActivities } from "~/hooks/raidhub/useRaidHubActivities"

type RaidsProps = {
    destinyMemberships: { destinyMembershipId: string; membershipType: BungieMembershipType }[]
    areMembershipsFetched: boolean
    layout: Layout
    setMostRecentActivity: (id: string | null | undefined) => void
}

const Raids = ({
    destinyMemberships,
    areMembershipsFetched,
    layout,
    setMostRecentActivity
}: RaidsProps) => {
    const bungie = useBungieClient()

    const statsQueries = bungie.stats.useQueries(destinyMemberships, {
        enabled: areMembershipsFetched
    })

    const characters = useMemo(
        () =>
            statsQueries
                .map(
                    q =>
                        q.data?.characters.map(({ characterId }) => ({
                            destinyMembershipId: q.data.destinyMembershipId,
                            membershipType: q.data.membershipType,
                            characterId
                        }))!
                )
                .filter(Boolean)
                .flat(),
        [statsQueries]
    )

    const areAllCharactersFound = statsQueries.every(q => q.isFetched)

    const characterQueries = bungie.characterStats.useQueries(characters, {
        enabled: areMembershipsFetched && areAllCharactersFound
    })

    const characterStats = useMemo(() => {
        if (characterQueries.every(q => q.isSuccess)) {
            const data = characterQueries.map(q => q.data!)
            return partitionStatsByRaid(data)
        } else {
            return null
        }
    }, [characterQueries])

    const { activities, isLoading: isLoadingActivities } = useRaidHubActivities(
        destinyMemberships.map(dm => dm.destinyMembershipId)
    )

    const activitiesByRaid = useMemo(() => {
        if (isLoadingActivities) return null

        return partitionCollectionByRaid(activities, a => a.raid)
    }, [activities, isLoadingActivities])

    useEffect(() => {
        if (!isLoadingActivities) {
            setMostRecentActivity(activities.find(a => a.completed)?.activityId ?? null)
        } else {
            setMostRecentActivity(undefined)
        }
    }, [activities, isLoadingActivities, setMostRecentActivity])

    const {
        value: expandedRaid,
        clear: clearExpandedRaid,
        set: setExpandedRaid
    } = useQueryParamState("raid", {
        decoder: value => zRaidURIComponent.optional().parse(value),
        encoder: raid => RaidToUrlPaths[raid]
    })

    const isLoadingStats =
        !areMembershipsFetched || !areAllCharactersFound || characterQueries.some(q => q.isLoading)

    if (expandedRaid) {
        return (
            <ExpandedRaidView
                raid={expandedRaid}
                dismiss={clearExpandedRaid}
                {...(isLoadingStats
                    ? { stats: undefined, isLoadingStats: true }
                    : {
                          stats:
                              characterStats?.get(expandedRaid) ?? new RaidStats([], expandedRaid),
                          isLoadingStats: false
                      })}
                {...(isLoadingActivities
                    ? { activities: undefined, isLoadingActivities: true }
                    : {
                          activities: activitiesByRaid?.get(expandedRaid) ?? new Collection(),
                          isLoadingActivities: false
                      })}
            />
        )
    }

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {ListedRaids.map(raid => (
                        <RaidCard
                            key={raid}
                            raid={raid}
                            expand={() => setExpandedRaid(raid)}
                            {...(isLoadingStats
                                ? {
                                      isLoadingStats: true,
                                      stats: null
                                  }
                                : {
                                      isLoadingStats: false,
                                      stats: characterStats?.get(raid) ?? new RaidStats([], raid)
                                  })}
                            {...(isLoadingActivities
                                ? {
                                      isLoadingActivities: true,
                                      activities: null
                                  }
                                : {
                                      isLoadingActivities: false,
                                      activities: activitiesByRaid?.get(raid) ?? new Collection()
                                  })}
                        />
                    ))}
                </div>
            )
        case Layout.RecentActivities:
            return isLoadingActivities ? (
                <RecentRaids isLoading={isLoadingActivities} allActivities={null} />
            ) : (
                <RecentRaids
                    isLoading={isLoadingActivities}
                    allActivities={activities ?? new Collection()}
                />
            )
    }
}

export default Raids
