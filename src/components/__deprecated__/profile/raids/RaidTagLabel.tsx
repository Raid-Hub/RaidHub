"use client"

import Link from "next/link"
import { useCallback } from "react"
import BasicDiamond from "~/components/icons/BasicDiamond"
import { useAttributedRaidName } from "~/hooks/useAttributedRaidName"
import { useDebouncedHover } from "~/hooks/util/useDebouncedHover"
import type { ListedRaid, RaidDifficulty } from "~/services/raidhub/types"
import styles from "./raids.module.css"

/** @deprecated */
const RaidTagLabel = ({
    instanceId,
    setActiveId,
    isBestPossible,
    ...tagProps
}: {
    setActiveId: (instanceId: string) => void
    instanceId: string
    isBestPossible: boolean
    raid: ListedRaid
    playerCount: number
    fresh: boolean | null
    flawless: boolean | null
    difficulty: RaidDifficulty
    contest: boolean
    completed: boolean
}) => {
    const hoverAction = useCallback(() => {
        setActiveId(instanceId)
    }, [setActiveId, instanceId])

    const { handleHover, handleLeave } = useDebouncedHover({ action: hoverAction, debounce: 750 })

    const label = useAttributedRaidName(tagProps, {
        excludeRaidName: true,
        includeFresh: true
    })

    function InnerTag() {
        return (
            <>
                {isBestPossible && <BasicDiamond sx={15} color="white" />}
                <span>{label}</span>
            </>
        )
    }

    return label ? (
        <Link
            className={styles["clickable-tag"]}
            href={`/pgcr/${instanceId}`}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}>
            <InnerTag />
        </Link>
    ) : null
}

export default RaidTagLabel
