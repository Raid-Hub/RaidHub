"use client"

import { useCallback, useMemo } from "react"
import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { PlayerTab } from "~/app/pgcr/components/PlayerTab"
import { SelectedPlayerView } from "~/app/pgcr/components/SelectedPlayerView"
import type { PGCRPageParams } from "~/app/pgcr/types"
import { Loading } from "~/components/Loading"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import styles from "../pgcr.module.css"

/** @deprecated */
const ParticipantsSection = () => {
    const { data, sortScores, isLoading } = usePGCRContext()
    const { set, get, remove } = useQueryParams<PGCRPageParams>()

    const setPlayer = useCallback(
        (membershipId: string | null) => {
            remove("character")
            if (!membershipId) {
                remove("player")
            } else {
                set("player", membershipId)
            }
        },
        [remove, set]
    )

    const selectedMembershipId = get("player")

    const selectedPlayer = selectedMembershipId
        ? data?.players.find(p => p.playerInfo.membershipId === selectedMembershipId) ?? null
        : null

    const pCount = data?.playerCount ?? 6
    const cardLayout =
        pCount < 4
            ? styles["members-low"]
            : pCount % 2
            ? styles["members-odd"]
            : styles["members-even"]

    const playersSorted = useMemo(
        () =>
            data?.players.toSorted(
                (a, b) =>
                    (sortScores.get(b.playerInfo.membershipId) ?? 0) -
                    (sortScores.get(a.playerInfo.membershipId) ?? 0)
            ) ?? [],
        [data?.players, sortScores]
    )

    if (!selectedPlayer || isLoading) {
        return (
            <div className={[styles.grid, cardLayout].join(" ")}>
                {playersSorted.map(player => (
                    <PlayerTab
                        key={player.playerInfo.membershipId}
                        activityPlayer={player}
                        onClick={() => setPlayer(player.playerInfo.membershipId)}
                    />
                )) ??
                    Array.from({ length: pCount }, (_, idx) => (
                        <Loading key={idx} $minHeight="90px" $alpha={0.8} />
                    ))}
            </div>
        )
    } else {
        return (
            <SelectedPlayerView selectedPlayer={selectedPlayer} deselect={() => setPlayer(null)} />
        )
    }
}
export default ParticipantsSection
