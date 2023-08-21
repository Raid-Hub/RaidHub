import styles from "../../styles/pages/pgcr.module.css"
import { useCallback } from "react"
import PGCRPlayer from "../../models/pgcr/Player"
import PlayerCell from "./PlayerCell"
import SelectedPlayerHeader from "./SelectedPlayerHeader"
import { useRouter } from "next/router"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import PlayerStatCells from "./PlayerStatCells"
import DestinyPGCRCharacter from "../../models/pgcr/Character"

type ParticipantsProps = {
    showScorePref: boolean
}

const ParticipantsSection = ({ showScorePref }: ParticipantsProps) => {
    const router = useRouter()
    const { pgcr, loadingState } = usePGCRContext()

    const getQueryValue = useCallback(
        (key: string) => {
            const q = router.query[key]
            if (Array.isArray(q) || q === undefined) {
                return ""
            } else {
                return q
            }
        },
        [router]
    )

    const setQueryValues = useCallback(
        (values: Partial<Record<"player" | "character", string>>) => {
            const query: typeof values = {}
            const player = values.player ?? router.query.player
            if (player) {
                query.player = String(player)
            }
            const character = values.character ?? router.query.character
            if (character) {
                query.character = String(character)
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

    const selectedPlayer: PGCRPlayer | null = pgcr?.players.get(getQueryValue("player")) ?? null
    const selectedCharacter: DestinyPGCRCharacter | null =
        selectedPlayer?.characters.get(getQueryValue("character")) ?? null

    const updatePlayerId = (clicked: string) => {
        selectedPlayer?.membershipId === clicked
            ? setQueryValues({
                  player: "",
                  character: ""
              })
            : setQueryValues({ player: clicked })
    }

    const updateCharacterId = (clicked: string) => {
        selectedCharacter?.characterId === clicked
            ? setQueryValues({ character: "" })
            : setQueryValues({ character: clicked })
    }

    const cardLayout = pgcr?.players
        ? pgcr.players.size < 4
            ? styles["members-low"]
            : pgcr.players.size % 2
            ? styles["members-odd"]
            : styles["members-even"]
        : styles["members-even"]

    // standard view
    if (!selectedPlayer || !pgcr?.players) {
        return (
            <div className={[styles["grid"], cardLayout].join(" ")}>
                {pgcr &&
                    pgcr.players.map((player, id) => (
                        <PlayerCell
                            key={id}
                            player={player}
                            selectedPlayerId={selectedPlayer?.membershipId ?? null}
                            isLoadingEmblems={!!loadingState}
                            dnf={pgcr.completed && !player.didComplete}
                            solo={pgcr.players.size === 1}
                            weightedScore={pgcr.weightedScores.get(id) ?? 0}
                            onClick={() => updatePlayerId(id)}
                            showScore={showScorePref}
                        />
                    ))}
            </div>
        )
    } else {
        // selected view
        return (
            <>
                {selectedPlayer && (
                    <SelectedPlayerHeader
                        selectedPlayer={selectedPlayer}
                        selectedCharacter={selectedCharacter}
                        onClick={() => updatePlayerId(selectedPlayer.membershipId)}
                        updateCharacterId={updateCharacterId}
                    />
                )}
                {(selectedCharacter ?? selectedPlayer) && (
                    <PlayerStatCells entry={selectedCharacter ?? selectedPlayer} />
                )}
            </>
        )
    }
}
export default ParticipantsSection
