import { useState } from "react"
import Link from "next/link"
import { Raid } from "../../util/raid"
import { Icons } from "../../util/icons"
import MemberCard from "./MemberCard"
import StatCards from "./StatCard"
import styles from "../../styles/pgcr.module.css"
import { useEmblems } from "../../hooks/emblems"
import { ErrorHandler, Loading } from "../../util/types"
import PGCRMember from "../../models/pgcr/Member"

type PGCREntriesProps = {
    members: PGCRMember[] | null
    raid: Raid
    pgcrLoadingState: Loading
    errorHandler: ErrorHandler
}

const PGCREntries = ({ members, raid, errorHandler }: PGCREntriesProps) => {
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

    if (memberIndex === -1 || !members) {
        return (
            <div className={[styles["members"], cardLayout].join(" ")}>
                {members?.map((member, idx) => (
                    <MemberCard
                        key={idx}
                        member={member}
                        index={idx}
                        raid={raid}
                        emblemBackground={emblems?.[member.characterIds[0]] ?? ""}
                        memberIndex={-1}
                        updateMemberIndex={updateMemberIndex}
                    />
                ))}
            </div>
        )
    } else {
        return (
            <div className={[styles["members"], cardLayout].join(" ")}>
                <MemberCard
                    member={members[memberIndex] ?? null}
                    index={memberIndex}
                    raid={raid}
                    emblemBackground={emblems?.[members[memberIndex]?.characterIds[0] ?? ""] ?? ""}
                    memberIndex={memberIndex}
                    updateMemberIndex={updateMemberIndex}
                />
                <div className={styles["class-button-container"]}>
                    {members?.[memberIndex].characters.map(({ logo }, idx) => (
                        <button
                            key={idx}
                            className={[
                                styles["soft-rectangle"],
                                styles["selectable"],
                                idx === characterIndex ? styles["selected"] : "",
                                styles["class-button"]
                            ].join(" ")}
                            onClick={members ? () => updateCharacterIndex(idx) : undefined}>
                            <img src={logo} />
                        </button>
                    ))}
                    <button
                        className={[
                            styles["member-profile-button"],
                            styles["soft-rectangle"],
                            styles["selectable"]
                        ].join(" ")}>
                        <Link
                            href={memberProfile()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles["member-profile-link"]}>
                            <img src={Icons.EXTERNAL} className={styles["view-profile-icon"]} />
                            <span>View Profile</span>
                        </Link>
                    </button>
                </div>
                <StatCards
                    entry={members[memberIndex].characters[characterIndex] ?? members[memberIndex]}
                    emblemBackground={emblems?.[members[memberIndex]?.characterIds[0]] ?? ""}
                />
            </div>
        )
    }
}
export default PGCREntries
