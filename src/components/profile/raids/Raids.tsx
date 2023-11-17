import styles from "~/styles/pages/profile/raids.module.css"
import { ListedRaid, ListedRaids } from "~/types/raids"
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
import { useRaidHubActivities } from "~/hooks/raidhub/useRaidHubActivities"
import { useRaidHubManifest } from "~/components/app/RaidHubManifestManager"
import { useRaidHubPlayers } from "~/hooks/raidhub/useRaidHubPlayers"
import { RaidHubPlayerResponse } from "~/types/raidhub-api"
import { useQuery } from "@tanstack/react-query"
import { postPlayer, postPlayerQueryKey } from "~/services/raidhub/postPlayer"

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
    const manifest = useRaidHubManifest()

    // todo deal with player memberships
    const { players, isLoading: isLoadingPlayers } = useRaidHubPlayers(
        destinyMemberships.map(dm => dm.destinyMembershipId)
    )

    const leaderboardEntriesByRaid = useMemo(() => {
        const boardIdToRaid = new Map<string, { raid: ListedRaid; key: string }>()
        Object.entries(manifest?.activityLeaderboards ?? {}).forEach(([raid, boards]) => {
            Object.entries(boards).forEach(([key, id]) => {
                boardIdToRaid.set(id, { raid: Number(raid), key })
            })
        })
        const raidToData = new Collection<
            ListedRaid,
            (RaidHubPlayerResponse["activityLeaderboardEntries"][string][number] & {
                key: string
            })[]
        >(ListedRaids.map(raid => [raid, []]))

        players.forEach(p => {
            Object.entries(p.activityLeaderboardEntries).forEach(([id, data]) => {
                if (boardIdToRaid.has(id)) {
                    const { raid, key } = boardIdToRaid.get(id)!
                    data.forEach(entry => {
                        raidToData.get(raid)!.push({ ...entry, key })
                    })
                }
            })
        })

        return raidToData
    }, [manifest, players])

    manifest?.activityLeaderboards

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

    // Send the details of this member to the RaidHub API for later validation
    useQuery({
        queryKey: postPlayerQueryKey(characters),
        queryFn: () => postPlayer(characters),
        staleTime: Infinity,
        retry: 2,
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

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {ListedRaids.map(raid => (
                        <RaidCard
                            key={raid}
                            raid={raid}
                            leaderboardData={leaderboardEntriesByRaid.get(raid)!}
                            wfBoard={manifest?.worldFirstBoards[raid] ?? null}
                            expand={() => setExpandedRaid(raid)}
                            clearExpand={clearExpandedRaid}
                            isExpanded={raid === expandedRaid}
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
