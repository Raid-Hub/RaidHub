"use client"

import { type ProfileProps } from "~/app/(profile)/types"
import { usePageProps } from "~/components/layout/PageWrapper"
import { useRaidHubPlayer } from "~/services/raidhub/useRaidHubPlayers"
import styles from "./ranks.module.css"

/** @deprecated */
export const ProfileRankings = () => {
    const { destinyMembershipId, ready } = usePageProps<ProfileProps>()

    const raidHubProfileQuery = useRaidHubPlayer(destinyMembershipId, {
        enabled: ready
    })

    return (
        <div className={styles.ranks}>
            <h1>{raidHubProfileQuery.data?.player.membershipType}</h1>
            {Object.entries(raidHubProfileQuery.data?.stats.global ?? {}).map(([key, stats]) => (
                <div key={key}>
                    <h3>{key}</h3>
                    <div>{stats.rank}</div>
                    <div>{stats.value}</div>
                </div>
            ))}
        </div>
    )
}
