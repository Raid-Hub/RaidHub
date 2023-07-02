import { useEffect, useState } from "react"
import { Raid } from "../../util/destiny/raid"
import { Icons } from "../../util/presentation/icons"
import StatCards from "./PlayerStatCards"
import styles from "../../styles/pgcr.module.css"
import { useEmblems } from "../../hooks/bungie/useEmblems"
import { ErrorHandler, Loading } from "../../types/generic"
import PGCRMember from "../../models/pgcr/Player"
import SelectedPlayer from "./SelectedPlayer"
import Player from "./Player"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { defaultEmblem } from "../../util/destiny/emblems"

type ParticipantsProps = {
    members: PGCRMember[] | null
    raid: Raid
    query: ParsedUrlQuery
    pgcrLoadingState: Loading
    errorHandler: ErrorHandler
}

const Participants = ({ members, query, errorHandler }: ParticipantsProps) => {
    const { emblems, isLoading: isLoadingEmblems } = useEmblems({
        members: members,
        errorHandler
    })

    const _memberIndex = () => parseInt(query["player"]?.toString() ?? "")
    const _characterIndex = () => parseInt(query["character"]?.toString() ?? "")
    const [memberIndex, setMemberIndex] = useState(isNaN(_memberIndex()) ? -1 : _memberIndex)
    const [characterIndex, setCharacterIndex] = useState(
        isNaN(_characterIndex()) ? -1 : _characterIndex
    )
    const router = useRouter()

    const updateMemberIndex = (clicked: number) => {
        memberIndex === clicked
            ? [setMemberIndex(-1), setCharacterIndex(-1)]
            : setMemberIndex(clicked)
    }

    const updateCharacterIndex = (clicked: number) => {
        characterIndex === clicked ? setCharacterIndex(-1) : setCharacterIndex(clicked)
    }

    useEffect(() => {
        const newQuery: ParsedUrlQuery = {
            activityId: router.query.activityId
        }
        if (memberIndex != -1) {
            newQuery.player = memberIndex.toString()
            if (characterIndex != -1) {
                newQuery.character = characterIndex.toString()
            }
        }
        if (
            router.query["player"] !== newQuery.player ||
            router.query["character"] !== newQuery.character
        ) {
            router.push({
                pathname: router.pathname,
                query: newQuery
            })
        }
    }, [memberIndex, characterIndex])

    useEffect(() => {
        if (!isNaN(_memberIndex())) {
            setMemberIndex(_memberIndex)

            if (!isNaN(_characterIndex())) {
                setCharacterIndex(_characterIndex)
            } else {
                setCharacterIndex(-1)
            }
        } else {
            setMemberIndex(-1)
            setCharacterIndex(-1)
        }
    }, [query])

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
                        emblemBackground={
                            "https://bungie.net" + emblems?.[member.characterIds[0]] ??
                            defaultEmblem
                        }
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
                        <a href={memberProfile()} className={styles["member-profile-link"]}>
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
