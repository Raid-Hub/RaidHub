import styles from "../../styles/pages/pgcr.module.css"
import { useState } from "react"
import { Raid } from "../../types/raids"
import StatCards from "./PlayerStatCells"
import { Loading } from "../../types/generic"
import PGCRPlayer from "../../models/pgcr/Player"
import PlayerCell from "./PlayerCell"
import SelectedPlayerHeader from "./SelectedPlayerHeader"
import { useEmblems } from "../app/DestinyManifestManager"

type ParticipantsProps = {
    players: PGCRPlayer[] | null
    raid: Raid
    pgcrLoadingState: Loading
}

const ParticipantsSection = ({ players: members, pgcrLoadingState }: ParticipantsProps) => {
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
                        isLoadingEmblems={pgcrLoadingState === Loading.HYDRATING}
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
