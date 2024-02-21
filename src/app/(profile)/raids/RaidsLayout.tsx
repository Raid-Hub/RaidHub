"use client"

import { Collection } from "@discordjs/collection"
import RaidCard from "components_old/profile/raids/RaidCard"
import { useMemo } from "react"
import { type ProfileProps } from "~/app/(profile)/types"
import { Grid } from "~/components/layout/Grid"
import { usePageProps } from "~/components/layout/PageWrapper"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { useRaidHubManifest } from "~/layout/managers/RaidHubManifestManager"
import { useLinkedProfiles } from "~/services/bungie/useLinkedProfiles"
import { useRaidHubActivities } from "~/services/raidhub/useRaidHubActivities"
import { useRaidHubPlayers } from "~/services/raidhub/useRaidHubPlayers"
import type {
    ListedRaid,
    RaidHubPlayerActivitiesActivity,
    RaidHubPlayerProfileLeaderboardEntry
} from "~/types/raidhub-api"
import { FilterContextProvider } from "./FilterContext"
import { RaidCardContext } from "./RaidCardContext"

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
            p.worldFirstEntries.forEach(entry => {
                if (boardIdToRaidLookup.has(entry.boardId)) {
                    const arr = raidToData.get(boardIdToRaidLookup.get(entry.boardId)!)!
                    arr.push(entry)
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
            if (!coll.has(a.meta.raid)) coll.set(a.meta.raid, new Collection())
            if (!coll.get(a.meta.raid)) coll.set(a.meta.raid, new Collection())
            coll.get(a.meta.raid)!.set(a.instanceId, a)
        })
        return coll.each(raidActivities => raidActivities.reverse())
    }, [activities, areMembershipsFetched, isLoadingActivities])

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

    return (
        <FilterContextProvider>
            <Grid as="section" $minCardWidth={325}>
                {listedRaids.map(raid => (
                    <RaidCardContext
                        key={raid}
                        activitiesByRaid={activitiesByRaid}
                        isLoadingActivities={isLoadingActivities}
                        raid={raid}>
                        <RaidCard
                            leaderboardData={leaderboardEntriesByRaid?.get(raid) ?? null}
                            wfBoardId={
                                (leaderboards.worldFirst[raid].find(b => b.type === "challenge") ??
                                    leaderboards.worldFirst[raid].find(b => b.type === "normal"))!
                                    .id
                            }
                            expand={() => setExpandedRaid(raid)}
                            closeExpand={clearExpandedRaid}
                            isExpanded={raid === getExpandedRaid()}
                        />
                    </RaidCardContext>
                ))}
            </Grid>
        </FilterContextProvider>
    )
}
