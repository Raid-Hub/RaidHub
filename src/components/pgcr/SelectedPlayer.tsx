import PGCRMember from "../../models/pgcr/Member"
import styles from "../../styles/pgcr.module.css"

type SelectedPlayerProps = {
    member: PGCRMember
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
            <div className={styles["emblem"]}>
                <img src={emblemBackground} />
            </div>
            <div className={styles["color-film"]} />

            <div className={styles["member-card"]}>
                <div className={[styles["member-name"], styles["centered"]].join(" ")}>
                    <span className={styles["contained-span"]}>{displayName}</span>
                    <span className={[styles["class-name"], styles["contained-span"]].join(" ")}>
                        {classString}
                    </span>
                </div>
            </div>
        </button>
    )
}

export default SelectedPlayer
