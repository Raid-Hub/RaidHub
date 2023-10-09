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
import { useQueries } from "@tanstack/react-query"
import { activitiesQueryKey, getActivities } from "~/services/raidhub/getActivities"

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

    const raidhubActivityQueries = useQueries({
        queries: destinyMemberships.map(({ destinyMembershipId }) => ({
            queryFn: () => getActivities(destinyMembershipId),
            queryKey: activitiesQueryKey(destinyMembershipId),
            enabled: areMembershipsFetched
        }))
    })

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

    const { data: activityHistory, isLoading: isLoadingActivities } =
        bungie.activityHistory.useQuery(characters, {
            staleTime: 60_000,
            enabled: areMembershipsFetched && areAllCharactersFound
        })

    const hasLoadedRaidhubActivities = raidhubActivityQueries.every(q => q.isSuccess)
    const raidhubActivities = useMemo(
        () =>
            new Collection(
                raidhubActivityQueries.flatMap(q => q.data ?? []).map(a => [a.activityId, a])
            ),
        [raidhubActivityQueries]
    )

    const activitiesByRaid = useMemo(() => {
        if (!activityHistory || !hasLoadedRaidhubActivities) return null

        raidhubActivities.forEach((activity, id) => activityHistory.get(id)?.addData(activity))

        return partitionCollectionByRaid(activityHistory, a => a.raid)
    }, [activityHistory, hasLoadedRaidhubActivities, raidhubActivities])

    useEffect(() => {
        if (activityHistory) {
            setMostRecentActivity(
                activityHistory.find(a => a.completed)?.activityDetails.instanceId ?? null
            )
        } else {
            setMostRecentActivity(undefined)
        }
    }, [activityHistory, setMostRecentActivity])

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
                    allActivities={activityHistory ?? new Collection()}
                />
            )
    }
}

export default Raids
