import { Collection } from "@discordjs/collection"
import { BungieMembershipType } from "bungie-net-core/models"
import { useEffect, useMemo } from "react"
import { useRaidHubManifest } from "~/app/managers/RaidHubManifestManager"
import { useQueryParamState } from "~/hooks/util/useQueryParamState"
import { useRaidHubActivities } from "~/services/raidhub/useRaidHubActivities"
import styles from "~/styles/pages/profile/raids.module.css"
import {
    ListedRaid,
    RaidHubPlayerProfileLeaderboardEntry,
    RaidHubPlayerResponse
} from "~/types/raidhub-api"
import { partitionCollectionByRaid } from "~/util/destiny/partitionCollectionByRaid"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { zRaidURIComponent } from "~/util/zod"
import { Layout } from "../mid/LayoutToggle"
import RaidCard from "./RaidCard"
import { RaidCardContext } from "./RaidContext"
import RecentRaids from "./RecentRaids"

type RaidsProps = {
    destinyMemberships: { destinyMembershipId: string; membershipType: BungieMembershipType }[]
    areMembershipsFetched: boolean
    layout: Layout
    setMostRecentActivity: (id: string | null | undefined) => void
    players: RaidHubPlayerResponse[]
}

const Raids = ({ destinyMemberships, layout, setMostRecentActivity, players }: RaidsProps) => {
    const { leaderboards, listedRaids } = useRaidHubManifest()

    const leaderboardEntriesByRaid = useMemo(() => {
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
    }, [leaderboards, listedRaids, players])

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

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {listedRaids.map(raid => (
                        <RaidCardContext
                            key={raid}
                            activitiesByRaid={activitiesByRaid}
                            isLoadingActivities={isLoadingActivities}
                            raid={raid}>
                            <RaidCard
                                raid={raid}
                                leaderboardData={leaderboardEntriesByRaid.get(raid)!}
                                wfBoardId={
                                    (leaderboards.worldFirst[raid].find(
                                        b => b.type === "challenge"
                                    ) ??
                                        leaderboards.worldFirst[raid].find(
                                            b => b.type === "normal"
                                        ))!.id
                                }
                                expand={() => setExpandedRaid(raid)}
                                clearExpand={clearExpandedRaid}
                                isExpanded={raid === expandedRaid}
                            />
                        </RaidCardContext>
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
