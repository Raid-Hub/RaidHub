import styles from "../../../styles/profile.module.css"
import Link from "next/link"
import { RaidTag } from "../../../types/profile"
import { Icons } from "../../../util/presentation/icons"
import { Tag } from "../../../util/raidhub/tags"
import { useLocale } from "../../app/LanguageProvider"
import { LocalStrings } from "../../../util/presentation/localized-strings"
import { Difficulty } from "../../../util/destiny/raid"

const RaidTagLabel = (tag: RaidTag) => {
    const { strings } = useLocale()
    return (
        <Link href={`/pgcr/${tag.instanceId}`} className={styles["clickable-tag"]}>
            {tag.bestPossible && <img src={Icons.FLAWLESS_DIAMOND} alt="mastery diamond" />}
            <span>{getLabel(tag, strings)}</span>
        </Link>
    )
}

function getLabel(tag: RaidTag, strings: LocalStrings) {
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
    if (tag.difficulty == Difficulty.MASTER) descriptors.push(strings.tags[Tag.MASTER])
    else if (tag.difficulty == Difficulty.CONTEST) descriptors.push(strings.tags[Tag.CONTEST])
    if (tag.fresh == false) descriptors.push(strings.checkpoints[tag.raid])
    let str = descriptors.join(" ")
    if (tag.fresh == null) str += "*"
    return str
}

export default RaidTagLabel
