import styles from "~/styles/pages/pgcr.module.css"
import PGCRPlayer from "~/models/pgcr/Player"
import Image from "next/image"
import { formattedNumber } from "~/util/presentation/formatting"
import { useLocale } from "../app/LocaleManager"
import { useItem } from "../app/DestinyManifestManager"
import { bannerEmblemUrl } from "~/util/destiny/bungie-icons"
import Kill from "~/images/icons/destiny2/Kill"
import SplitHeart from "~/images/icons/SplitHeart"
import Death from "~/images/icons/destiny2/Death"
import BasicDiamond from "~/images/icons/BasicDiamond"

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
    const { locale, strings } = useLocale()
    const dynamicCssClass = player.membershipId === selectedPlayerId ? styles["selected"] : ""

    const { data: emblem } = useItem(player.banner)

    const completionClass = dnf ? styles["dnf"] : ""
    const Icon = player.characters.first()!.logo
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
                    src={bannerEmblemUrl(emblem)}
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
                    <Icon sx={80} color="white" />
                </div>
            )}

            <div className={styles["member-name"]}>
                <span className={styles["contained-span"]}>{displayName}</span>
            </div>
            <div className={styles["quick-stats-container"]}>
                {solo ? (
                    <BasicDiamond sx={50} color="white" />
                ) : showScore ? (
                    <span className={styles["score-only"]}>
                        {formattedNumber(weightedScore, locale)}
                    </span>
                ) : (
                    <div className={styles["quick-stats"]}>
                        <div className={styles["quick-stat"]}>
                            <Kill sx={12} color="white" />
                            <span>{player.stats.kills}</span>
                        </div>
                        <div className={styles["quick-stat"]}>
                            <SplitHeart sx={12} color="white" />
                            <span>{player.stats.assists}</span>
                        </div>
                        <div className={styles["quick-stat"]}>
                            <Death sx={12} color="white" />
                            <span>{player.stats.deaths}</span>
                        </div>
                    </div>
                )}
            </div>
        </button>
    )
}

export default PlayerCell
