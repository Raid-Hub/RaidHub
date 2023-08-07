import styles from "../../styles/pages/pgcr.module.css"
import PGCRPlayer from "../../models/pgcr/Player"
import Image from "next/image"
import { useMemo } from "react"
import { useEmblems } from "../app/DestinyManifestManager"
import { bannerEmblemFromHash } from "../../util/destiny/emblems"

type SelectedPlayerProps = {
    member: PGCRPlayer
    index: number
    memberIndex: number
    updateMemberIndex: (clicked: number) => void
    characterIndex: number
}

const SelectedPlayer = ({
    member,
    index,
    memberIndex,
    updateMemberIndex,
    characterIndex
}: SelectedPlayerProps) => {
    const displayName = member.displayName || member.membershipId
    const dynamicCssClass = memberIndex === index ? styles["selected"] : ""
    const completionClass = member.didComplete ? "" : styles["dnf"]
    const emblemsDictionary = useEmblems()

    const character = useMemo(
        () => member.characters[characterIndex == -1 ? 0 : characterIndex],
        [member, characterIndex]
    )

    const classString =
        characterIndex != -1
            ? character.className
            : member.characters.map(c => c.className).join(" | ")

    return (
        <button
            key={index}
            className={[
                styles["selected-entry-card"],
                styles["selectable"],
                dynamicCssClass,
                completionClass
            ].join(" ")}
            onClick={() => updateMemberIndex(index)}>
            <Image
                src={bannerEmblemFromHash(character.banner, emblemsDictionary)}
                alt=""
                fill
                className={styles["emblem"]}
            />
            <div className={styles["color-film"]} />

            <div className={[styles["member-name"], styles["centered"]].join(" ")}>
                <span className={styles["contained-span"]}>{displayName}</span>
                <span className={[styles["class-name"], styles["contained-span"]].join(" ")}>
                    {classString}
                </span>
            </div>
        </button>
    )
}

export default SelectedPlayer
