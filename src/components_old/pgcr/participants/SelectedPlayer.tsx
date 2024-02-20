import Image from "next/image"
import { characterNames } from "~/data/strings/character-names"
import { useItemDefinition } from "~/hooks/dexie/useItemDefinition"
import styles from "~/styles/pages/pgcr.module.css"
import PGCRCharacter from "../../../util/destiny/Character"
import PGCRPlayer from "../../../util/destiny/Player"
import { bungieBannerEmblemUrl } from "../../../util/destiny/bungie-icons"

type SelectedPlayerProps = {
    player: PGCRPlayer
    character: PGCRCharacter | null
    onClick: () => void
}

const SelectedPlayer = ({ player, character, onClick }: SelectedPlayerProps) => {
    const emblem = useItemDefinition(character?.banner ?? player.banner)

    const displayName = player.displayName || player.membershipId
    const completionClass = player.didComplete ? "" : styles["dnf"]

    const classString =
        character?.classType !== undefined
            ? characterNames[character.classType]
            : player.characters.map(c => characterNames[c.classType]).join(" | ")

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
                src={bungieBannerEmblemUrl(emblem ?? null)}
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
