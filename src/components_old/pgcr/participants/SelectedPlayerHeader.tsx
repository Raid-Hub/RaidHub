import Link from "next/link"
import ExternalLink from "~/images/icons/ExternalLink"
import styles from "~/styles/pages/pgcr.module.css"
import PGCRCharacter from "~/util/destiny/Character"
import PGCRPlayer from "~/util/destiny/Player"
import SelectedPlayer from "./SelectedPlayer"

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
    return (
        <div className={styles["members-header"]}>
            <SelectedPlayer
                player={selectedPlayer}
                character={selectedCharacter}
                onClick={onClick}
            />
            {selectedPlayer.characters.size > 1 && (
                <div className={styles["class-button-container"]}>
                    {selectedPlayer.characters.map(({ logo: Logo, characterId }) => (
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
                            <Logo color="white" width="100%" />
                        </button>
                    ))}
                </div>
            )}
            <Link
                href={`/profile/${selectedPlayer.membershipType}/${selectedPlayer.membershipId}`}
                className={[styles["member-profile-button"], styles["selectable"]].join(" ")}>
                <span>View Profile</span>
                <ExternalLink sx={30} color="white" />
            </Link>
        </div>
    )
}

export default SelectedPlayerHeader
