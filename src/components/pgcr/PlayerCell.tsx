import styles from "../../styles/pages/pgcr.module.css"
import PGCRPlayer from "../../models/pgcr/Player"
import Image from "next/image"
import { Assists, Deaths, Diamond1, Kills } from "../../images/icons"
import { useMemo } from "react"

type PlayerCellProps = {
    member: PGCRPlayer
    index: number
    emblemBackground: string
    memberIndex: number
    solo: boolean
    isLoadingEmblems: boolean
    updateMemberIndex: (clicked: number) => void
}

const PlayerCell = ({
    member,
    index,
    emblemBackground,
    memberIndex,
    solo,
    isLoadingEmblems,
    updateMemberIndex
}: PlayerCellProps) => {
    const dynamicCssClass = useMemo(
        () => (memberIndex === index ? styles["selected"] : ""),
        [memberIndex, index]
    )
    const { completionClass, icon, displayName } = useMemo(
        () => ({
            completionClass: member.didComplete ? "" : styles["dnf"],
            icon: member.characters[0].logo,
            displayName: member.displayName ?? member.membershipId
        }),
        [member]
    )

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
            {!isLoadingEmblems ? (
                <Image
                    src={emblemBackground}
                    alt={`Emblem for ${member.displayName}`}
                    fill
                    className={styles["emblem"]}
                />
            ) : (
                <div className={styles["emblem"]} />
            )}
            <div className={styles["color-film"]} />

            {member.characters.length && (
                <div className={styles["class-logo-container"]}>
                    <Image
                        src={icon}
                        alt={member.characters[0].className}
                        fill
                        className={styles["class-logo"]}
                    />
                </div>
            )}

            <div className={styles["member-name"]}>
                <span className={styles["contained-span"]}>{displayName}</span>
            </div>
            <div className={styles["quick-stats-container"]}>
                {solo ? (
                    <Image
                        className={styles["flawless-diamond"]}
                        src={Diamond1}
                        alt={member.displayName + " went flawless this raid"}
                    />
                ) : (
                    <div className={styles["quick-stats"]}>
                        <div className={styles["quick-stat"]}>
                            {<Image src={Kills} alt={"Kills"} />}
                            <span>{member.stats.kills}</span>
                        </div>
                        <div className={styles["quick-stat"]}>
                            {<Image src={Assists} alt={"Assists"} />}
                            <span>{member.stats.assists}</span>
                        </div>
                        <div className={styles["quick-stat"]}>
                            {<Image src={Deaths} alt={"Deaths"} />}
                            <span>{member.stats.deaths}</span>
                        </div>
                    </div>
                )}
            </div>
        </button>
    )
}

export default PlayerCell
