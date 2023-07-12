import styles from "../../styles/pages/pgcr.module.css"
import PGCRPlayer from "../../models/pgcr/Player"
import Image from "next/image"

type SelectedPlayerProps = {
    member: PGCRPlayer
    index: number
    emblemBackground: string
    memberIndex: number
    updateMemberIndex: (clicked: number) => void
    characterIndex: number
}

const SelectedPlayer = ({
    member,
    index,
    emblemBackground,
    memberIndex,
    updateMemberIndex,
    characterIndex
}: SelectedPlayerProps) => {
    const classString =
        characterIndex != -1
            ? member.characterClass[characterIndex]
            : member.characterClass.join(" | ")
    const displayName = member.displayName ?? member.membershipId
    const dynamicCssClass = memberIndex === index ? styles["selected"] : ""
    const completionClass = member.didComplete ? "" : styles["dnf"]
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
                src={emblemBackground}
                alt={`Emblem for ${member.displayName}`}
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
