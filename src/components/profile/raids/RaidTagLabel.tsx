import Link from "next/link"
import { useLocale } from "~/components/app/LocaleManager"
import useHover from "~/hooks/util/useDebouncedHover"
import BasicDiamond from "~/images/icons/BasicDiamond"
import styles from "~/styles/pages/profile/raids.module.css"
import { RaidTag } from "~/types/profile"
import { LocalStrings } from "~/util/presentation/localized-strings"
import { Tag } from "~/util/tags"

type RaidTagLabelProps = {
    setActiveId: (instanceId: string) => void
} & RaidTag

const RaidTagLabel = (props: RaidTagLabelProps) => {
    const { strings } = useLocale()

    const action = () => {
        props.activityId && props.setActiveId(props.activityId)
    }

    const { handleHover, handleLeave } = useHover({ action, debounce: 750 })

    const label = getChallengeLabel(props, strings)

    function InnerTag() {
        return (
            <>
                {props.bestPossible && <BasicDiamond sx={15} color="white" />}
                <span>{label}</span>
            </>
        )
    }

    return label ? (
        props.activityId ? (
            <Link
                className={styles["clickable-tag"]}
                href={`/pgcr/${props.activityId}`}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}>
                <InnerTag />
            </Link>
        ) : (
            <div className={styles["clickable-tag"]}>
                <InnerTag />
            </div>
        )
    ) : null
}

function getChallengeLabel(tag: RaidTag, strings: LocalStrings): string | null {
    // special cases
    let wishWall = false
    if (tag.raid === 4 && tag.playerCount === 1 && tag.fresh) {
        wishWall = true
    }
    const descriptors: string[] = []
    if (tag.fresh && !tag.flawless) descriptors.push(strings.tags[Tag.FRESH])
    switch (tag.playerCount) {
        case 1:
            descriptors.push(strings.tags[Tag.SOLO])
            break
        case 2:
            descriptors.push(strings.tags[Tag.DUO])
            break
        case 3:
            descriptors.push(strings.tags[Tag.TRIO])
            break
    }
    if (tag.flawless) descriptors.push(strings.tags[Tag.FLAWLESS])
    if (tag.difficulty == 4) descriptors.push(strings.tags[Tag.MASTER])
    else if (tag.difficulty == 128) descriptors.push(strings.tags[Tag.CONTEST])
    if (tag.fresh == false) descriptors.push(strings.checkpoints[tag.raid])
    let str = descriptors.join(" ")
    if (wishWall) str += " (Wishwall)"
    if (tag.fresh == null) str += "*"
    return str
}

export default RaidTagLabel
