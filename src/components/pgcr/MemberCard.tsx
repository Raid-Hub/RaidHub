import PGCRMember from "../../models/pgcr/Member"
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
    characterIndex: number
}

const MemberCard = ({
    member,
    index,
    raid,
    emblemBackground,
    memberIndex,
    updateMemberIndex,
    characterIndex
}: MemberCardProps) => {
    const dynamicCssClass = memberIndex === index ? styles["selected"] : ""
    const completionClass = member?.didComplete ? "" : styles["dnf"]
    return (
        <button
            key={index}
            className={[
                styles["soft-rectangle"],
                styles["selected-entry-card"],
                styles["selectable"],
                dynamicCssClass,
                completionClass
            ].join(" ")}
            onClick={member ? () => updateMemberIndex(index) : undefined}>
            <div className={styles["emblem"]}>
                <img src={emblemBackground} />
            </div>
            <div className={styles["color-film"]} />

            {memberIndex === -1 || !member ? (
                <StandardMemberCard member={member} />
            ) : (
                <SelectedMemberCard
                    member={member}
                    destinyClasses={member.characterClass}
                    characterIndex={characterIndex}
                />
            )}
        </button>
    )
}

export default MemberCard

const StandardMemberCard = ({ member }: { member: PGCRMember | null }) => {
    const icon = member?.characters?.[0].logo
    const displayName = member?.displayName ?? member?.membershipId
    return (
        <div className={styles["member-card"]}>
            <div className={styles["class-logo"]}>{member?.characters && <img src={icon} />}</div>
            <div className={styles["member-name"]}>
                <span className={styles["contained-span"]}>{displayName}</span>
            </div>
            <div className={styles["quick-stats-container"]}>
                {member?.flawless ? (
                    <img
                        className={styles["flawless-diamond"]}
                        src={Icons.FLAWLESS_DIAMOND}
                        alt={member.displayName + " went flawless this raid"}
                    />
                ) : (
                    <div className={styles["quick-stats"]}>
                        <div className={styles["quick-stat"]}>
                            {<img src={Icons.KILLS} alt={"Kills"} />}
                            <span>{member?.stats.kills}</span>
                        </div>
                        <div className={styles["quick-stat"]}>
                            {<img src={Icons.ASSISTS} alt={"Assists"} />}
                            <span>{member?.stats.assists}</span>
                        </div>
                        <div className={styles["quick-stat"]}>
                            {<img src={Icons.DEATHS} alt={"Deaths"} />}
                            <span>{member?.stats.deaths}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const SelectedMemberCard = ({
    member,
    destinyClasses,
    characterIndex
}: {
    member: PGCRMember
    destinyClasses: string[]
    characterIndex: number
}) => {
    const displayName = member.displayName ?? member.membershipId
    const classString =
        characterIndex != -1 ? destinyClasses[characterIndex] : destinyClasses.join("/")
    return (
        <div className={styles["member-card"]}>
            <div className={[styles["member-name"], styles["centered"]].join(" ")}>
                <span className={styles["contained-span"]}>{displayName}</span>
                <span className={[styles["class-name"], styles["contained-span"]].join(" ")}>
                    {classString}
                </span>
            </div>
        </div>
    )
}
