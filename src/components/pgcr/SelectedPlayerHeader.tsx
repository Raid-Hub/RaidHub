import styles from "../../styles/pages/pgcr.module.css"
import PGCRPlayer from "../../models/pgcr/Player"
import SelectedPlayer from "./SelectedPlayer"
import Image from "next/image"
import { useMemo } from "react"
import { External } from "../../images/icons"
import { useLocale } from "../app/LanguageProvider"

type SelectedPlayerHeaderProps = {
    selected: PGCRPlayer
    selectedIndex: number
    characterIndex: number
    emblemBackground: string
    updateMemberIndex: (clicked: number) => void
    updateCharacterIndex: (clicked: number) => void
}
const SelectedPlayerHeader = ({
    selected,
    selectedIndex,
    characterIndex,
    emblemBackground,
    updateMemberIndex,
    updateCharacterIndex
}: SelectedPlayerHeaderProps) => {
    const { strings } = useLocale()
    const memberProfileURL = useMemo(() => {
        const { membershipId, membershipType } = selected
        if (!membershipId || !membershipType) return `/`
        return `/profile/${membershipType}/${membershipId}`
    }, [selected])

    return (
        <div className={styles["members-header"]}>
            <SelectedPlayer
                member={selected ?? null}
                index={selectedIndex}
                emblemBackground={emblemBackground}
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
            <button className={[styles["member-profile-button"], styles["selectable"]].join(" ")}>
                <a href={memberProfileURL} className={styles["member-profile-link"]}>
                    <Image
                        src={External}
                        alt={"View profile"}
                        className={styles["view-profile-icon"]}
                    />
                    <span>{strings.viewProfile}</span>
                </a>
            </button>
        </div>
    )
}

export default SelectedPlayerHeader
