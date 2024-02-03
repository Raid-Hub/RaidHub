import Link from "next/link"
import { useLocale } from "~/app/managers/LocaleManager"
import useHover from "~/hooks/util/useDebouncedHover"
import styles from "~/styles/pages/profile/raids.module.css"
import { RaceTag } from "~/types/profile"
import { LocalStrings } from "~/util/presentation/localized-strings"
import { wfRaceMode } from "~/util/tags"

type RaidTagLabelProps = {
    instanceId?: string
    setActiveId: (instanceId: string) => void
} & RaceTag

const RaceTagLabel = (props: RaidTagLabelProps) => {
    const { strings } = useLocale()

    const action = () => {
        props.instanceId && props.setActiveId(props.instanceId)
    }

    const { handleHover, handleLeave } = useHover({ action, debounce: 750 })

    const label = getRaceLabel(props, strings)

    return label ? (
        props.instanceId ? (
            <Link
                className={styles["race-tag"]}
                href={`/pgcr/${props.instanceId}`}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}>
                <span>{label}</span>
            </Link>
        ) : (
            <div className={styles["race-tag"]}>
                <span>{label}</span>
            </div>
        )
    ) : null
}

function getRaceLabel(props: RaceTag, strings: LocalStrings): string | null {
    const tag = wfRaceMode(props)
    if (tag) {
        return `${strings.tags[tag]}${
            props.placement && props.placement <= 500 ? ` #${props.placement}` : ""
        }`
    } else {
        return null
    }
}

export default RaceTagLabel
