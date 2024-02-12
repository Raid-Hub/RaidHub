"use client"

import { Collection } from "@discordjs/collection"
import { useMemo } from "react"
import { useRaidHubManifest } from "~/app/(layout)/managers/RaidHubManifestManager"
import { type ProfileProps } from "~/app/(profile)/types"
import { Grid } from "~/components/layout/Grid"
import { usePageProps } from "~/components/layout/PageWrapper"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { useLinkedProfiles } from "~/services/bungie/useLinkedProfiles"
import { useRaidHubActivities } from "~/services/raidhub/useRaidHubActivities"
import { useRaidHubPlayers } from "~/services/raidhub/useRaidHubPlayers"
import type {
    ListedRaid,
    RaidHubPlayerActivitiesActivity,
    RaidHubPlayerProfileLeaderboardEntry
} from "~/types/raidhub-api"

enum Layout {
    DotCharts,
    RecentActivities
}

/** @deprecated */
export const Raids = () => {
    const { destinyMembershipId, destinyMembershipType, ready } = usePageProps<ProfileProps>()

    const { data: membershipsData, isFetched: areMembershipsFetched } = useLinkedProfiles({
        membershipId: destinyMembershipId
    })

    const destinyMemberships = useMemo(
        () =>
            membershipsData?.profiles.map(p => ({
                destinyMembershipId: p.membershipId,
                membershipType: p.membershipType
            })) ?? [
                // Fallback to the current profile if the linked profiles are not yet fetched
                {
                    destinyMembershipId: destinyMembershipId,
                    membershipType: destinyMembershipType
                }
            ],
        [membershipsData, destinyMembershipId, destinyMembershipType]
    )

    // Memoize the membership IDs for the players queries, otherwise the queries will re-render
    // every time the component re-renders
    const membershipIds = useMemo(
        () => destinyMemberships?.map(dm => dm.destinyMembershipId) ?? [],
        [destinyMemberships]
    )
    const { players, isLoading: isLoadingPlayers } = useRaidHubPlayers(membershipIds, {
        enabled: ready
    })

    const { activities, isLoading: isLoadingActivities } = useRaidHubActivities(membershipIds)

    const { leaderboards, listedRaids } = useRaidHubManifest()

    const leaderboardEntriesByRaid = useMemo(() => {
        if (isLoadingPlayers || !areMembershipsFetched) return null

        // Map board IDs to raids for lookup
        const boardIdToRaidLookup = new Map<string, ListedRaid>(
            Object.entries(leaderboards.worldFirst)
                .map(([raid, boards]) =>
                    boards.map(({ id }) => [id, Number(raid) as ListedRaid] as const)
                )
                .flat()
        )

        const raidToData = new Collection<ListedRaid, RaidHubPlayerProfileLeaderboardEntry[]>(
            listedRaids.map(raid => [raid, []])
        )

        players.forEach(p => {
            Object.entries(p.worldFirstEntries).forEach(([leaderboardId, data]) => {
                if (boardIdToRaidLookup.has(leaderboardId)) {
                    const arr = raidToData.get(boardIdToRaidLookup.get(leaderboardId)!)!
                    arr.push(data)
                }
            })
        })

        return raidToData
    }, [isLoadingPlayers, areMembershipsFetched, leaderboards.worldFirst, listedRaids, players])

    const activitiesByRaid = useMemo(() => {
        if (isLoadingActivities || !areMembershipsFetched) return null

        const coll = new Collection<
            ListedRaid,
            Collection<string, RaidHubPlayerActivitiesActivity>
        >()
        activities.forEach(a => {
            if (!coll.has(a.meta.raidId)) coll.set(a.meta.raidId, new Collection())
            coll.get(a.meta.raidId)!.set(a.instanceId, a)
        })
        return coll
    }, [activities, areMembershipsFetched, isLoadingActivities])

    // useEffect(() => {
    //     if (!isLoadingActivities) {
    //         setMostRecentActivity(activities.find(a => a.completed)?.instanceId ?? null)
    //     } else {
    //         setMostRecentActivity(undefined)
    //     }
    // }, [activities, isLoadingActivities, setMostRecentActivity])

    const queryParams = useQueryParams<{
        raid: string
    }>()

    const { getExpandedRaid, clearExpandedRaid, setExpandedRaid } = useMemo(
        () => ({
            getExpandedRaid: () => {
                const queryValue = queryParams.get("raid")
                return queryValue ? (Number(queryValue) as ListedRaid) : null
            },
            clearExpandedRaid: () => queryParams.remove("raid"),
            setExpandedRaid: (raid: ListedRaid) => queryParams.set("raid", String(raid))
        }),
        [queryParams]
    )

    const layout = Layout.DotCharts // todo

    return (
        <Grid as="section">
            {/* {
                layout === Layout.DotCharts
                    ? listedRaids.map(raid => (
                          <RaidCardContext
                              key={raid}
                              activitiesByRaid={activitiesByRaid}
                              isLoadingActivities={isLoadingActivities}
                              raid={raid}>
                              <RaidCard
                                  leaderboardData={leaderboardEntriesByRaid?.get(raid) ?? null}
                                  wfBoardId={
                                      (leaderboards.worldFirst[raid].find(
                                          b => b.type === "challenge"
                                      ) ??
                                          leaderboards.worldFirst[raid].find(
                                              b => b.type === "normal"
                                          ))!.id
                                  }
                                  expand={() => setExpandedRaid(raid)}
                                  closeExpand={clearExpandedRaid}
                                  isExpanded={raid === getExpandedRaid()}
                              />
                          </RaidCardContext>
                      ))
                    : null
                // <RecentRaids
                //     isLoading={isLoadingActivities}
                //     allActivities={activities ?? new Collection()}
                // />
            } */}
        </Grid>
    )
    // switch (layout) {
    //     case Layout.DotCharts:
    //         return (

    //         )
    //     case Layout.RecentActivities:
    //         return isLoadingActivities ? (
    //             <RecentRaids isLoading={isLoadingActivities} allActivities={null} />
    //         ) : (

    //         )
    // }
}
