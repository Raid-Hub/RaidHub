import styles from "../../../styles/pages/profile/raids.module.css"
import Link from "next/link"
import { Difficulty, Raid, wfRaceMode } from "../../../util/destiny/raid"
import { useLocale } from "../../app/LanguageProvider"
import { useCallback, useState } from "react"
import { Icons } from "../../../util/presentation/icons"
import { RaidTag } from "../../../types/profile"
import { LocalStrings } from "../../../util/presentation/localized-strings"
import { Tag } from "../../../util/raidhub/tags"

type RaidTagLabelProps = {
    instanceId?: string
    scrollToDot: (instanceId: string) => void
} & (
    | ({
          type: "challenge"
      } & RaidTag)
    | { type: "race"; placement?: number; asterisk?: boolean; raid: Raid }
)
const RaidTagLabel = (props: RaidTagLabelProps) => {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

    const scroll = () => {
        props.instanceId && props.scrollToDot(props.instanceId)
    }

    const handleHover = () => {
        const timeout = setTimeout(scroll, 750)
        setTimer(timeout)
    }

    const handleLeave = useCallback(() => {
        timer && clearTimeout(timer)
    }, [timer])

    const className = styles["clickable-tag"]
    return props.instanceId ? (
        <Link
            className={className}
            href={`/pgcr/${props.instanceId}`}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}>
            <InnerTag {...props} />
        </Link>
    ) : (
        <div className={className}>
            <InnerTag {...props} />
        </div>
    )
}

const InnerTag = (props: RaidTagLabelProps) => {
    const { strings } = useLocale()
    return (
        <>
            <span>
                {props.type === "challenge"
                    ? getChallengeLabel(props, strings)
                    : `${strings.tags[wfRaceMode(props.raid)]}${props.asterisk ? "*" : ""}${
                          props.placement ? ` #${props.placement}` : ""
                      }`}
            </span>
            {props.type === "challenge" && props.bestPossible && (
                <img src={Icons.FLAWLESS_DIAMOND} alt="mastery diamond" />
            )}
        </>
    )
}

function getChallengeLabel(tag: RaidTag, strings: LocalStrings) {
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
