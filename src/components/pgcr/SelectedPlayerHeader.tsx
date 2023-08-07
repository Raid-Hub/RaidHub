import styles from "../../styles/pages/pgcr.module.css"
import PGCRPlayer from "../../models/pgcr/Player"
import SelectedPlayer from "./SelectedPlayer"
import Image from "next/image"
import { External } from "../../images/icons"
import { useLocale } from "../app/LocaleManager"
import { useRouter } from "next/router"
import Link from "next/link"

type SelectedPlayerHeaderProps = {
    selected: PGCRPlayer
    selectedIndex: number
    characterIndex: number
    updateMemberIndex: (clicked: number) => void
    updateCharacterIndex: (clicked: number) => void
}
const SelectedPlayerHeader = ({
    selected,
    selectedIndex,
    characterIndex,
    updateMemberIndex,
    updateCharacterIndex
}: SelectedPlayerHeaderProps) => {
    const { strings } = useLocale()
    const router = useRouter()

    return (
        <div className={styles["members-header"]}>
            <SelectedPlayer
                member={selected ?? null}
                index={selectedIndex}
                memberIndex={selectedIndex}
                updateMemberIndex={updateMemberIndex}
                characterIndex={characterIndex}
            />
            {selected.characters.length > 1 && (
                <div className={styles["class-button-container"]}>
                    {selected.characters.map(({ logo, className }, idx) => (
                        <button
                            key={idx}
                            className={[
                                styles["selectable"],
                                idx === characterIndex ? styles["selected"] : "",
                                styles["class-button"]
                            ].join(" ")}
                            onClick={() => updateCharacterIndex(idx)}>
                            <Image src={logo} alt={className} />
                        </button>
                    ))}
                </div>
            )}
            <Link
                href={`/profile/${selected.membershipType}/${selected.membershipId}`}
                className={[styles["member-profile-button"], styles["selectable"]].join(" ")}>
                <Image
                    src={External}
                    alt={"View profile"}
                    className={styles["view-profile-icon"]}
                />
                <span>{strings.viewProfile}</span>
            </Link>
        </div>
    )
}

export default SelectedPlayerHeader
