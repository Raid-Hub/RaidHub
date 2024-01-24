import styles from "~/styles/pages/profile/raids.module.css"
import { ListedRaid, ListedRaids } from "~/types/raids"
import RaidCard from "./RaidCard"
import { useEffect, useMemo } from "react"
import RecentRaids from "./RecentRaids"
import { Layout } from "../mid/LayoutToggle"
import { BungieMembershipType } from "bungie-net-core/models"
import { Collection } from "@discordjs/collection"
import { partitionCollectionByRaid } from "~/util/destiny/partitionCollectionByRaid"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { useQueryParamState } from "~/hooks/util/useQueryParamState"
import { zRaidURIComponent } from "~/util/zod"
import { useRaidHubActivities } from "~/hooks/raidhub/useRaidHubActivities"
import { useRaidHubManifest } from "~/components/app/RaidHubManifestManager"
import { useRaidHubPlayers } from "~/hooks/raidhub/useRaidHubPlayers"
import {
    RaidHubManifestBoard,
    RaidHubPlayerLeaderboardEntry,
    RaidHubPlayerResponse
} from "~/types/raidhub-api"
import { RaidCardContext } from "./RaidContext"

type RaidsProps = {
    destinyMemberships: { destinyMembershipId: string; membershipType: BungieMembershipType }[]
    areMembershipsFetched: boolean
    layout: Layout
    setMostRecentActivity: (id: string | null | undefined) => void
    players: RaidHubPlayerResponse[]
}

const Raids = ({ destinyMemberships, layout, setMostRecentActivity, players }: RaidsProps) => {
    const manifest = useRaidHubManifest()

    const leaderboardEntriesByRaid = useMemo(() => {
        const boardIdToRaid = new Map<string, ListedRaid>()
        Object.entries(manifest?.leaderboards.worldFirst ?? {}).forEach(([raid, boards]) => {
            boards.forEach(({ id }) => {
                boardIdToRaid.set(id, Number(raid))
            })
        })
        const raidToData = new Collection<
            ListedRaid,
            (RaidHubPlayerLeaderboardEntry & RaidHubManifestBoard)[]
        >(ListedRaids.map(raid => [raid, []]))

        players.forEach(p => {
            Object.entries(p.worldFirstEntries).forEach(([id, data]) => {
                if (boardIdToRaid.has(id)) {
                    const raid = boardIdToRaid.get(id)!
                    data.forEach(entry => {
                        raidToData.get(raid)!.push({
                            ...entry,
                            ...manifest?.leaderboards.worldFirst[raid].find(b => b.id === id)!
                        })
                    })
                }
            })
        })

        return raidToData
    }, [manifest, players])

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
                    {ListedRaids.map(raid => (
                        <RaidCardContext
                            key={raid}
                            activitiesByRaid={activitiesByRaid}
                            isLoadingActivities={isLoadingActivities}
                            raid={raid}>
                            <RaidCard
                                raid={raid}
                                leaderboardData={leaderboardEntriesByRaid.get(raid)!}
                                wfBoardId={
                                    (manifest?.leaderboards.worldFirst[raid].some(
                                        b => b.type === "challenge"
                                    )
                                        ? manifest.leaderboards.worldFirst[raid].find(
                                              b => b.type === "challenge"
                                          )?.id
                                        : manifest?.leaderboards.worldFirst[raid].find(
                                              b => b.type === "normal"
                                          )?.id) ?? null
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
