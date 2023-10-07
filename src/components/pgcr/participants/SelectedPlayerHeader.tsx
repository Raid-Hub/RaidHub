import styles from "~/styles/pages/pgcr.module.css"
import PGCRPlayer from "~/models/pgcr/Player"
import SelectedPlayer from "./SelectedPlayer"
import { useLocale } from "../../app/LocaleManager"
import Link from "next/link"
import PGCRCharacter from "~/models/pgcr/Character"
import ExternalLink from "~/images/icons/ExternalLink"

type SelectedPlayerHeaderProps = {
    selectedPlayer: PGCRPlayer
    selectedCharacter: PGCRCharacter | null
    onClick: () => void
    updateCharacterId: (clicked: string) => void
}
const SelectedPlayerHeader = ({
    selectedPlayer,
    selectedCharacter,
    onClick,
    updateCharacterId
}: SelectedPlayerHeaderProps) => {
    const { strings } = useLocale()

    return (
        <div className={styles["members-header"]}>
            <SelectedPlayer
                player={selectedPlayer}
                character={selectedCharacter}
                onClick={onClick}
            />
            {selectedPlayer.characters.size > 1 && (
                <div className={styles["class-button-container"]}>
                    {selectedPlayer.characters.map(({ logo: Logo, characterId, classType }) => (
                        <button
                            key={characterId}
                            className={[
                                styles["selectable"],
                                selectedCharacter?.characterId === characterId
                                    ? styles["selected"]
                                    : "",
                                styles["class-button"]
                            ].join(" ")}
                            onClick={() => updateCharacterId(characterId)}>
                            <Logo color="white" />
                        </button>
                    ))}
                </div>
            )}
            <Link
                href={`/profile/${selectedPlayer.membershipType}/${selectedPlayer.membershipId}`}
                className={[styles["member-profile-button"], styles["selectable"]].join(" ")}>
                <span>{strings.viewProfile}</span>
                <ExternalLink sx={30} color="white" />
            </Link>
        </div>
    )
}

export default SelectedPlayerHeader
