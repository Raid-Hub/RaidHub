import { PGCRMember } from "../../models/pgcr/Entry"
import styles from "../../styles/pgcr.module.css"
import { Icons } from "../../util/icons"
import { Raid } from "../../util/raid"

type MemberCardProps = {
    member: PGCRMember | null
    index: number
    raid: Raid
    emblemBackground: string
    memberIndex: number
    updateMemberIndex: (clicked: number) => void
}

const MemberCard = ({
    member,
    index,
    raid,
    emblemBackground,
    memberIndex,
    updateMemberIndex
}: MemberCardProps) => {
    const dynamicCssClass = memberIndex === index ? styles["selected"] : styles["selectable"]
    const completionClass = member?.didComplete ? "" : styles["dnf"]
    return (
        <button
            key={index}
            className={[
                styles["soft-rectangle"],
                styles["entry-card"],
                styles["selectable"],
                dynamicCssClass,
                completionClass
            ].join(" ")}
            onClick={member ? () => updateMemberIndex(index) : undefined}>
            <img src={emblemBackground} className={styles["emblem"]} />
            <div className={[styles["member-card-container"], styles["color-film"]].join(" ")}>
                {memberIndex === -1 || !member ? (
                    <StandardMemberCard member={member} />
                ) : (
                    <SelectedMemberCard member={member} />
                )}
            </div>
        </button>
    )
}

export default MemberCard

const StandardMemberCard = ({ member }: { member: PGCRMember | null }) => {
    const icon = member?.characters?.[0].logo
    const displayName = member?.displayName ?? member?.membershipId
    const displayClass = member?.characterClass
    return (
        <div className={styles["member-card"]}>
            <div className={styles["class-logo"]}>{member?.characters && <img src={icon} />}</div>
            <div className={styles["member-properties"]}>
                <div className={styles["member-name"]}>
                    <span className={styles["contained-span"]}>{displayName}</span>
                </div>
                <div className={styles["member-class"]}>
                    <span className={styles["contained-span"]}>{displayClass}</span>
                </div>
            </div>
            <div className={styles["flawless-diamond"]}>
                {member?.flawless && (
                    <img
                        src={Icons.FLAWLESS_DIAMOND}
                        alt={member.displayName + " went flawless this raid"}
                    />
                )}
            </div>
        </div>
    )
}

const SelectedMemberCard = ({ member }: { member: PGCRMember }) => {
    const displayName = member.displayName ?? member.membershipId
    const displayClass = member.characterClass
    return (
        <div className={styles["member-card"]}>
            <div className={[styles["member-properties"], styles["centered"]].join(" ")}>
                <div className={styles["member-name"]}>
                    <span className={styles["contained-span"]}>{displayName}</span>
                </div>
                <div className={styles["member-class"]}>
                    <span className={styles["contained-span"]}>{displayClass}</span>
                </div>
            </div>
        </div>
    )
}
