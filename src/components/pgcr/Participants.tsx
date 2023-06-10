import { useState } from "react"
import { Raid } from "../../util/raid"
import { Icons } from "../../util/icons"
import StatCards from "./PlayerStatCards"
import styles from "../../styles/pgcr.module.css"
import { useEmblems } from "../../hooks/emblems"
import { ErrorHandler, Loading } from "../../util/types"
import PGCRMember from "../../models/pgcr/Member"
import SelectedPlayer from "./SelectedPlayer"
import Player from "./Player"

type ParticipantsProps = {
    members: PGCRMember[] | null
    raid: Raid
    pgcrLoadingState: Loading
    errorHandler: ErrorHandler
}

const Participants = ({ members, errorHandler }: ParticipantsProps) => {
    const { emblems, isLoading: isLoadingEmblems } = useEmblems({
        members: members ?? [],
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

    const memberProfile = () => {
        if (!members) return `/`
        const member = members[memberIndex]
        const id = member.membershipId
        const platform = member.membershipType
        if (!id || !platform) return `/`
        return `/profile/${platform}/${id}`
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
            <div className={[styles["members"], cardLayout].join(" ")}>
                {members?.map((member, idx) => (
                    <Player
                        key={idx}
                        member={member}
                        index={idx}
                        emblemBackground={emblems?.[member.characterIds[0]] ?? ""}
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
                <div className={styles["members-header"]}>
                    <SelectedPlayer
                        member={members[memberIndex] ?? null}
                        index={memberIndex}
                        emblemBackground={
                            emblems?.[
                                members[memberIndex]?.characterIds[
                                    characterIndex != -1 ? characterIndex : 0
                                ] ?? ""
                            ] ?? ""
                        }
                        memberIndex={memberIndex}
                        updateMemberIndex={updateMemberIndex}
                        characterIndex={characterIndex}
                    />
                    {members[memberIndex].characters.length > 1 && (
                        <div className={styles["class-button-container"]}>
                            {members[memberIndex].characters.map(({ logo, className }, idx) => (
                                <button
                                    key={idx}
                                    className={[
                                        styles["selectable"],
                                        idx === characterIndex ? styles["selected"] : "",
                                        styles["class-button"]
                                    ].join(" ")}
                                    onClick={() => updateCharacterIndex(idx)}>
                                    <img src={logo} alt={className} />
                                </button>
                            ))}
                        </div>
                    )}
                    <button
                        className={[styles["member-profile-button"], styles["selectable"]].join(
                            " "
                        )}>
                        <a
                            href={memberProfile()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles["member-profile-link"]}>
                            <img
                                src={Icons.EXTERNAL}
                                alt={"View profile"}
                                className={styles["view-profile-icon"]}
                            />
                            <span>View Profile</span>
                        </a>
                    </button>
                </div>
                <div className={[styles["members"], cardLayout].join(" ")}>
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
export default Participants
