import PGCRMember from "../../models/pgcr/Member"
import styles from "../../styles/pgcr.module.css"
import { Icons } from "../../util/icons"

type PlayerProps = {
    member: PGCRMember
    index: number
    emblemBackground: string
    memberIndex: number
    updateMemberIndex: (clicked: number) => void
}

const Player = ({
    member,
    index,
    emblemBackground,
    memberIndex,
    updateMemberIndex
}: PlayerProps) => {
    const dynamicCssClass = memberIndex === index ? styles["selected"] : ""
    const completionClass = member.didComplete ? "" : styles["dnf"]
    const icon = member.characters[0].logo
    const displayName = member.displayName ?? member.membershipId
    return (
        <button
            key={index}
            className={[
                styles["entry-card"],
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
                <div className={styles["class-logo"]}>
                    {member.characters.length && <img src={icon} />}
                </div>
                <div className={styles["member-name"]}>
                    <span className={styles["contained-span"]}>{displayName}</span>
                </div>
                <div className={styles["quick-stats-container"]}>
                    {member.flawless ? (
                        <img
                            className={styles["flawless-diamond"]}
                            src={Icons.FLAWLESS_DIAMOND}
                            alt={member.displayName + " went flawless this raid"}
                        />
                    ) : (
                        <div className={styles["quick-stats"]}>
                            <div className={styles["quick-stat"]}>
                                {<img src={Icons.KILLS} alt={"Kills"} />}
                                <span>{member.stats.kills}</span>
                            </div>
                            <div className={styles["quick-stat"]}>
                                {<img src={Icons.ASSISTS} alt={"Assists"} />}
                                <span>{member.stats.assists}</span>
                            </div>
                            <div className={styles["quick-stat"]}>
                                {<img src={Icons.DEATHS} alt={"Deaths"} />}
                                <span>{member.stats.deaths}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </button>
    )
}

export default Player
