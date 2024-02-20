import Link from "next/link"
import { useCallback } from "react"
import { Tag } from "~/hooks/useTags"
import { useDebouncedHover } from "~/hooks/util/useDebouncedHover"
import { useRaidHubManifest } from "~/layout/managers/RaidHubManifestManager"
import type { ListedRaid } from "~/types/raidhub-api"
import styles from "./raids.module.css"

/** @deprecated */
const RaceTagLabel = ({
    instanceId,
    setActiveId,
    ...tagProps
}: {
    placement: number
    instanceId: string
    dayOne: boolean
    contest: boolean
    weekOne: boolean
    challenge: boolean
    raid: ListedRaid
    setActiveId: (instanceId: string) => void
}) => {
    const label = useRaceLabel(tagProps)

    const hoverAction = useCallback(() => {
        setActiveId(instanceId)
    }, [instanceId, setActiveId])

    const { handleHover, handleLeave } = useDebouncedHover({ action: hoverAction, debounce: 750 })

    return label ? (
        <Link
            className={styles["race-tag"]}
            href={`/pgcr/${instanceId}`}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}>
            <span>{label}</span>
        </Link>
    ) : null
}

const useRaceLabel = (props: {
    placement: number
    dayOne: boolean
    contest: boolean
    weekOne: boolean
    challenge: boolean
    raid: ListedRaid
}): string | null => {
    const tag = useRaceMode(props)
    if (tag) {
        return `${tag}${props.placement && props.placement <= 500 ? ` #${props.placement}` : ""}`
    } else {
        return null
    }
}

const useRaceMode = ({
    challenge,
    raid,
    dayOne,
    contest,
    weekOne
}: {
    raid: ListedRaid
    dayOne: boolean | undefined
    challenge: boolean | undefined
    contest: boolean | undefined
    weekOne: boolean | undefined
}) => {
    const { reprisedRaids } = useRaidHubManifest()

    const challengeName = reprisedRaids.find(r => r.raid === raid)?.triumphName
    if (challenge && challengeName) {
        return challengeName
    } else if (dayOne) {
        return Tag.DAY_ONE
    } else if (contest) {
        return Tag.CONTEST
    } else if (weekOne) {
        return Tag.WEEK_ONE
    } else {
        return null
    }
}

export default RaceTagLabel
