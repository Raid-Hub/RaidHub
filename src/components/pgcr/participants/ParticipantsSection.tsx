import { useRouter } from "next/router"
import { useCallback } from "react"
import styles from "~/styles/pages/pgcr.module.css"
import DestinyPGCRCharacter from "../../../util/destiny/Character"
import PGCRPlayer from "../../../util/destiny/Player"
import { usePGCRContext } from "../PGCR"
import KillsBreakdown from "./KillsBreakdown"
import PlayerCell from "./PlayerCell"
import PlayerStatCells from "./PlayerStatCells"
import SelectedPlayerHeader from "./SelectedPlayerHeader"

type ParticipantsProps = {
    showScorePref: boolean
}

const ParticipantsSection = ({ showScorePref }: ParticipantsProps) => {
    const router = useRouter()
    const { data: pgcr, isLoading } = usePGCRContext()

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
        (values: Partial<{ player: string; character: string; weapons: boolean }>) => {
            const query: typeof values = {}
            const player = values.player ?? router.query.player
            if (player) {
                query.player = String(player)
            }
            const character = values.character ?? router.query.character
            if (character) {
                query.character = String(character)
            }
            const weapons = values.weapons ?? router.query.weapons
            if (weapons === true || weapons === "true") {
                query.weapons = true
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
    const isShowingWeaponsView = getQueryValue("weapons") === "true"

    const updatePlayerId = (clicked: string) => {
        selectedPlayer?.membershipId === clicked
            ? setQueryValues({
                  player: "",
                  character: "",
                  weapons: false
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
                            isLoadingEmblems={isLoading}
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
                <SelectedPlayerHeader
                    selectedPlayer={selectedPlayer}
                    selectedCharacter={selectedCharacter}
                    onClick={() => updatePlayerId(selectedPlayer.membershipId)}
                    updateCharacterId={updateCharacterId}
                />
                {!isShowingWeaponsView ? (
                    <PlayerStatCells
                        entry={selectedCharacter ?? selectedPlayer}
                        showWeaponsDetails={() => setQueryValues({ weapons: true })}
                    />
                ) : (
                    <KillsBreakdown
                        entry={selectedCharacter ?? selectedPlayer}
                        back={() => setQueryValues({ weapons: false })}
                    />
                )}
            </>
        )
    }
}
export default ParticipantsSection
