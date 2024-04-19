"use client"

import { Collection } from "@discordjs/collection"
import { useMemo } from "react"
import styled from "styled-components"
import { type ProfileProps } from "~/app/(profile)/types"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { TabSelector } from "~/components/TabSelector"
import RaidCard from "~/components/__deprecated__/profile/raids/RaidCard"
import { Grid } from "~/components/layout/Grid"
import { usePageProps } from "~/components/layout/PageWrapper"
import { H4 } from "~/components/typography/H4"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { useLinkedProfiles } from "~/services/bungie/hooks"
import { useRaidHubActivities, useRaidHubPlayers } from "~/services/raidhub/hooks"
import type {
    ListedRaid,
    RaidHubPlayerActivitiesActivity,
    RaidHubPlayerProfileLeaderboardEntry
} from "~/services/raidhub/types"
import { ActivityHistoryLayout } from "./ActivityHistoryLayout"
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
                // Fallback to the only current profile if the linked profiles are not yet fetched
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
        if (isLoadingActivities) return null

        const coll = new Collection<
            ListedRaid,
            Collection<string, RaidHubPlayerActivitiesActivity>
        >()
        activities.forEach(a => {
            if (!coll.has(a.meta.activityId)) coll.set(a.meta.activityId, new Collection())
            if (!coll.get(a.meta.activityId)) coll.set(a.meta.activityId, new Collection())
            coll.get(a.meta.activityId)!.set(a.instanceId, a)
        })
        return coll.each(raidActivities => raidActivities.reverse())
    }, [activities, isLoadingActivities])

    const queryParams = useQueryParams<{
        raid: string
    }>()

    const [clearExpandedRaid, setExpandedRaid] = useMemo(
        () => [
            () => queryParams.remove("raid"),
            (raid: ListedRaid) => queryParams.set("raid", String(raid))
        ],
        [queryParams]
    )

    const expandedRaid = Number(queryParams.get("raid"))

    const [tab, setTab] = useLocalStorage<"classic" | "history">("player-profile-tab", "classic")

    return (
        <FilterContextProvider>
            <TabSelector>
                <Tab aria-selected={tab === "classic"} onClick={() => setTab("classic")}>
                    Classic
                </Tab>
                <Tab aria-selected={tab === "history"} onClick={() => setTab("history")}>
                    History
                </Tab>
            </TabSelector>
            {tab === "classic" ? (
                <Grid
                    as="section"
                    $minCardWidth={325}
                    $minCardWidthMobile={300}
                    $fullWidth
                    $relative>
                    {listedRaids.map(raid => (
                        <RaidCardContext
                            key={raid}
                            activitiesByRaid={activitiesByRaid}
                            isLoadingActivities={isLoadingActivities || !areMembershipsFetched}
                            raid={raid}>
                            <RaidCard
                                leaderboardData={leaderboardEntriesByRaid?.get(raid) ?? null}
                                expand={() => setExpandedRaid(raid)}
                                closeExpand={clearExpandedRaid}
                                isExpanded={raid === expandedRaid}
                            />
                        </RaidCardContext>
                    ))}
                </Grid>
            ) : (
                <ActivityHistoryLayout membershipIds={membershipIds} />
            )}
        </FilterContextProvider>
    )
}

const Tab = styled(H4)`
    padding: 0.5rem;
`

Tab.defaultProps = {
    $mBlock: 0.2
}
