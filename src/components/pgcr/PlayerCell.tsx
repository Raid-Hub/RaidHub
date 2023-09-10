import styles from "../../styles/pages/pgcr.module.css"
import PGCRPlayer from "../../models/pgcr/Player"
import Image from "next/image"
import { Assists, Deaths, Diamond1, Kills } from "../../images/icons"
import { bannerEmblemFromCache } from "../../util/destiny/emblems"
import { formattedNumber } from "../../util/presentation/formatting"
import { useLocale } from "../app/LocaleManager"
import { useItem } from "../app/DestinyManifestManager"

type PlayerCellProps = {
    player: PGCRPlayer
    selectedPlayerId: string | null
    solo: boolean
    isLoadingEmblems: boolean
    dnf: boolean
    weightedScore: number
    showScore: boolean
    onClick: () => void
}

const PlayerCell = ({
    player,
    selectedPlayerId,
    solo,
    isLoadingEmblems,
    dnf,
    weightedScore,
    showScore,
    onClick
}: PlayerCellProps) => {
    const { locale } = useLocale()
    const dynamicCssClass = player.membershipId === selectedPlayerId ? styles["selected"] : ""

    const { data: emblem } = useItem(player.banner)

    const completionClass = dnf ? styles["dnf"] : ""
    const icon = player.characters.first()!.logo
    const displayName = player.displayName || player.membershipId

    return (
        <button
            className={[
                styles["entry-card"],
                styles["selectable"],
                dynamicCssClass,
                completionClass
            ].join(" ")}
            onClick={onClick}>
            {!isLoadingEmblems && emblem ? (
                <Image
                    unoptimized
                    src={bannerEmblemFromCache(emblem)}
                    alt=""
                    fill
                    className={styles["emblem"]}
                />
            ) : (
                <div className={styles["emblem"]} />
            )}
            <div className={styles["color-film"]} />

            {player.characters.size && (
                <div className={styles["class-logo-container"]}>
                    <Image
                        src={icon}
                        alt={player.characters.first()!.className}
                        sizes="80px"
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
                        width={40}
                        height={40}
                        className={styles["flawless-diamond"]}
                        src={Diamond1}
                        alt={player.displayName + " went flawless this raid"}
                    />
                ) : showScore ? (
                    <span className={styles["score-only"]}>
                        {formattedNumber(weightedScore, locale)}
                    </span>
                ) : (
                    <div className={styles["quick-stats"]}>
                        <div className={styles["quick-stat"]}>
                            {<Image src={Kills} alt={"Kills"} width={12} height={12} />}
                            <span>{player.stats.kills}</span>
                        </div>
                        <div className={styles["quick-stat"]}>
                            {<Image src={Assists} alt={"Assists"} width={12} height={12} />}
                            <span>{player.stats.assists}</span>
                        </div>
                        <div className={styles["quick-stat"]}>
                            {<Image src={Deaths} alt={"Deaths"} width={12} height={12} />}
                            <span>{player.stats.deaths}</span>
                        </div>
                    </div>
                )}
            </div>
        </button>
    )
}

export default PlayerCell
