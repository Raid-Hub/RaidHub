import styles from "../../styles/pages/pgcr.module.css"
import { useState } from "react"
import { Raid } from "../../types/raids"
import StatCards from "./PlayerStatCells"
import { ErrorHandler, Loading } from "../../types/generic"
import PGCRPlayer from "../../models/pgcr/Player"
import SelectedPlayer from "./SelectedPlayer"
import PlayerCell from "./PlayerCell"
import { defaultEmblem } from "../../util/destiny/emblems"
import DestinyPGCRCharacter from "../../models/pgcr/Character"
import { useEmblems } from "../../hooks/bungie/useEmblems"
import Image from "next/image"
import { External } from "../../images/icons"
import SelectedPlayerHeader from "./SelectedPlayerHeader"

type ParticipantsProps = {
    players: PGCRPlayer[] | null
    characters: DestinyPGCRCharacter[]
    raid: Raid
    pgcrLoadingState: Loading
    errorHandler: ErrorHandler
}

const ParticipantsSection = ({
    players: members,
    pgcrLoadingState,
    characters,
    errorHandler
}: ParticipantsProps) => {
    const { emblems, isLoading: isLoadingEmblems } = useEmblems({
        characters,
        pgcrLoadingState,
        errorHandler
    })

    const [memberIndex, setMemberIndex] = useState(-1)
    const [characterIndex, setCharacterIndex] = useState(-1)

    const updateMemberIndex = (clicked: number) => {
        memberIndex === clicked
            ? [setMemberIndex(-1), setCharacterIndex(-1)]
            : setMemberIndex(clicked)
    }

    const updateCharacterIndex = (clicked: number) => {
        characterIndex === clicked ? setCharacterIndex(-1) : setCharacterIndex(clicked)
    }

    const cardLayout = members
        ? members.length < 4 && memberIndex === -1
            ? styles["members-low"]
            : members.length % 2 && memberIndex === -1
            ? styles["members-odd"]
            : styles["members-even"]
        : styles["members-even"]

    // standard view
    if (memberIndex === -1 || !members) {
        return (
            <div className={[styles["grid"], cardLayout].join(" ")}>
                {members?.map((member, idx) => (
                    <PlayerCell
                        solo={members.length === 1}
                        key={member.membershipId}
                        member={member}
                        index={idx}
                        emblemBackground={
                            "https://bungie.net" +
                            (emblems?.[member.characterIds[0]] ?? defaultEmblem)
                        }
                        isLoadingEmblems={isLoadingEmblems}
                        memberIndex={-1}
                        updateMemberIndex={updateMemberIndex}
                    />
                ))}
            </div>
        )
    } else {
        // selected view
        return (
            <>
                <SelectedPlayerHeader
                    selected={members[memberIndex]}
                    selectedIndex={memberIndex}
                    emblemBackground={
                        "https://bungie.net" +
                            emblems?.[
                                members[memberIndex].characterIds[
                                    characterIndex != -1 ? characterIndex : 0
                                ]
                            ] ?? defaultEmblem
                    }
                    characterIndex={characterIndex}
                    updateMemberIndex={updateMemberIndex}
                    updateCharacterIndex={updateCharacterIndex}
                />
                <div className={[styles["grid"], cardLayout].join(" ")}>
                    <StatCards
                        entry={
                            members[memberIndex].characters[characterIndex] ?? members[memberIndex]
                        }
                    />
                </div>
            </>
        )
    }
}
export default ParticipantsSection
