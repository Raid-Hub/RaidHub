"use client"

import { useCallback } from "react"
import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { PlayerTab } from "~/app/pgcr/components/PlayerTab"
import { SelectedPlayerView } from "~/app/pgcr/components/SelectedPlayerView"
import type { PGCRPageParams } from "~/app/pgcr/types"
import { Loading } from "~/components/Loading"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import styles from "../pgcr.module.css"

/** @deprecated */
const ParticipantsSection = () => {
    const { pgcrPlayers, activity } = usePGCRContext()
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
        ? pgcrPlayers?.get(selectedMembershipId) ?? null
        : null

    const pCount = pgcrPlayers?.size ?? activity?.playerCount ?? 6
    const cardLayout =
        pCount < 4
            ? styles["members-low"]
            : pCount % 2
            ? styles["members-odd"]
            : styles["members-even"]

    if (!selectedPlayer || !pgcrPlayers) {
        return (
            <div className={[styles.grid, cardLayout].join(" ")}>
                {pgcrPlayers?.map((player, id) => (
                    <PlayerTab key={id} player={player} onClick={() => setPlayer(id)} />
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
