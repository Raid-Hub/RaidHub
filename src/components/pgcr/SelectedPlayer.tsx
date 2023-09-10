import styles from "../../styles/pages/pgcr.module.css"
import PGCRPlayer from "../../models/pgcr/Player"
import Image from "next/image"
import { bannerEmblemFromCache } from "../../util/destiny/bungie-icons"
import PGCRCharacter from "../../models/pgcr/Character"
import { useItem } from "../app/DestinyManifestManager"

type SelectedPlayerProps = {
    player: PGCRPlayer
    character: PGCRCharacter | null
    onClick: () => void
}

const SelectedPlayer = ({ player, character, onClick }: SelectedPlayerProps) => {
    const { data: emblem } = useItem(character?.banner ?? player.banner)

    const displayName = player.displayName || player.membershipId
    const completionClass = player.didComplete ? "" : styles["dnf"]

    const classString = character?.className ?? player.characters.map(c => c.className).join(" | ")

    return (
        <button
            className={[
                styles["selected-entry-card"],
                styles["selectable"],
                styles["selected"],
                completionClass
            ].join(" ")}
            onClick={onClick}>
            <Image
                unoptimized
                src={bannerEmblemFromCache(emblem ?? null)}
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
