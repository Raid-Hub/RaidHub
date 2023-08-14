import styles from "../../styles/pages/pgcr.module.css"
import { useCallback } from "react"
import StatCards from "./PlayerStatCells"
import { Loading } from "../../types/generic"
import PGCRPlayer from "../../models/pgcr/Player"
import PlayerCell from "./PlayerCell"
import SelectedPlayerHeader from "./SelectedPlayerHeader"
import { useRouter } from "next/router"
import { IPGCREntry } from "../../types/pgcr"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"

type ParticipantsProps = {
    showScorePref: boolean
}

const ParticipantsSection = ({ showScorePref }: ParticipantsProps) => {
    const router = useRouter()
    const { pgcr, loadingState } = usePGCRContext()

    const getQueryValue = useCallback(
        (key: string, maxValue: number) => {
            const index = Number(router.query[key])
            if (!isNaN(index) && index <= maxValue) {
                return index
            } else {
                return -1
            }
        },
        [router]
    )

    const setQueryValues = useCallback(
        (values: Partial<Record<"player" | "character", number>>) => {
            const query: typeof values = {}
            const player = values.player ?? Number(router.query.player)
            if (player >= 0) {
                query.player = player
            }
            const character = values.character ?? Number(router.query.character)
            if (character >= 0) {
                query.character = character
            }
            router.push(
                {
                    query: {
                        ...query,
                        activityId: router.query.activityId
                    }
                },
                undefined,
                {
                    shallow: true
                }
            )
        },
        [router]
    )

    const memberIndex = getQueryValue("player", pgcr?.players.length ?? 0)
    const selected: PGCRPlayer | null = pgcr?.players[memberIndex] ?? null

    const characterIndex = getQueryValue(
        "character",
        pgcr?.players[memberIndex]?.characterIds.length ?? 0
    )
    const entry: IPGCREntry | null = selected?.characters[characterIndex] ?? selected ?? null

    const updateMemberIndex = (clicked: number) => {
        memberIndex === clicked
            ? setQueryValues({
                  player: -1,
                  character: -1
              })
            : setQueryValues({ player: clicked })
    }

    const updateCharacterIndex = (clicked: number) => {
        characterIndex === clicked
            ? setQueryValues({ character: -1 })
            : setQueryValues({ character: clicked })
    }

    const cardLayout = pgcr?.players
        ? pgcr.players.length < 4 && memberIndex === -1
            ? styles["members-low"]
            : pgcr.players.length % 2 && memberIndex === -1
            ? styles["members-odd"]
            : styles["members-even"]
        : styles["members-even"]

    // standard view
    if (memberIndex === -1 || !pgcr?.players) {
        return (
            <div className={[styles["grid"], cardLayout].join(" ")}>
                {pgcr?.players.map((member, idx) => (
                    <PlayerCell
                        solo={pgcr?.players.length === 1}
                        key={member.membershipId}
                        member={member}
                        index={idx}
                        isLoadingEmblems={loadingState === Loading.HYDRATING}
                        memberIndex={-1}
                        dnf={pgcr?.completed && !member.didComplete}
                        weightedScore={pgcr?.weightedScores.get(member.membershipId) ?? 0}
                        updateMemberIndex={updateMemberIndex}
                        showScore={showScorePref}
                    />
                ))}
            </div>
        )
    } else {
        // selected view
        return (
            <>
                {selected && (
                    <SelectedPlayerHeader
                        selected={selected}
                        selectedIndex={memberIndex}
                        characterIndex={characterIndex}
                        updateMemberIndex={updateMemberIndex}
                        updateCharacterIndex={updateCharacterIndex}
                    />
                )}
                <div className={[styles["grid"], cardLayout].join(" ")}>
                    {entry && <StatCards entry={entry} />}
                </div>
            </>
        )
    }
}
export default ParticipantsSection
