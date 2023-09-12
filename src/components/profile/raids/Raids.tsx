import styles from "~/styles/pages/profile/raids.module.css"
import { ListedRaids } from "~/types/raids"
import RaidCard from "./RaidCard"
import { useEffect, useMemo } from "react"
import { ExtendedActivity } from "~/types/profile"
import { FilterCallback } from "~/types/generic"
import RecentRaids from "./RecentRaids"
import { Layout } from "../mid/LayoutToggle"
import { useBungieClient } from "~/components/app/TokenManager"
import { BungieMembershipType } from "bungie-net-core/models"
import RaidStatsCollection from "~/models/profile/data/RaidStatsCollection"
import ActivityCollection, { applyFilter } from "~/models/profile/data/ActivityCollection"
import { Collection } from "@discordjs/collection"

type RaidsProps = {
    destinyMemberships: { destinyMembershipId: string; membershipType: BungieMembershipType }[]
    areMembershipsFetched: boolean
    layout: Layout
    filter: FilterCallback<ExtendedActivity>
    setMostRecentActivity: (id: string | null | undefined) => void
}

const Raids = ({
    destinyMemberships,
    areMembershipsFetched,
    layout,
    filter,
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

    const areCharactersAllFound = statsQueries.every(q => q.isFetched)

    // todo: make sure we arent making this call many times
    const { data, isLoading: isLoadingActivities } = bungie.activityHistory.useQuery(characters, {
        staleTime: 60_000,
        enabled: areMembershipsFetched && areCharactersAllFound
    })

    const characterQueries = bungie.characterStats.useQueries(characters, {
        enabled: areMembershipsFetched && areCharactersAllFound
    })

    const characterStats = useMemo(() => {
        if (characterQueries.every(q => q.data)) {
            return RaidStatsCollection.groupActivities(
                characterQueries.map(q => q.data!.activities).flat()
            )
        }
    }, [characterQueries])

    useEffect(() => {
        if (data?.allActivities) {
            setMostRecentActivity(
                data.allActivities.find(a => a.completed)?.activityDetails.instanceId ?? null
            )
        } else {
            setMostRecentActivity(undefined)
        }
    }, [data?.allActivities, setMostRecentActivity])

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {ListedRaids.map(raid => (
                        <RaidCard
                            key={raid}
                            raid={raid}
                            stats={characterStats?.get(raid)}
                            isLoadingStats={
                                !areMembershipsFetched ||
                                !areCharactersAllFound ||
                                characterQueries.some(q => q.isLoading)
                            }
                            activities={data?.activitiesByRaid.get(raid) ?? null}
                            isLoadingActivities={isLoadingActivities}
                            filter={filter}
                        />
                    ))}
                </div>
            )
        case Layout.RecentActivities:
            return (
                <RecentRaids
                    isLoading={isLoadingActivities}
                    allActivitiesFiltered={applyFilter(
                        data?.allActivities ?? new Collection(),
                        filter,
                        {}
                    )}
                />
            )
    }
}

export default Raids
