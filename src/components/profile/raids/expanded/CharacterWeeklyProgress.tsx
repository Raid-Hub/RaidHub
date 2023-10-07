import {
    DestinyCharacterComponent,
    DestinyMilestone,
    DestinyMilestoneActivityPhase
} from "bungie-net-core/models"
import Image from "next/image"
import { useLocale } from "~/components/app/LocaleManager"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { raidTupleFromHash } from "~/util/destiny/raidUtils"
import styles from "./expanded-raid.module.css"

export default function CharacterWeeklyProgress({
    character,
    milestone
}: {
    character: DestinyCharacterComponent
    milestone: DestinyMilestone
}) {
    const { strings } = useLocale()
    return (
        <div style={{ border: "1px solid var(--border)", padding: "1em" }}>
            <div className={styles["character-progress-header"]}>
                <h4>{strings.characterNames[character.classType]}</h4>
                <div className={styles["image-container"]}>
                    <Image src={bungieIconUrl(character.emblemPath)} alt="" fill unoptimized />
                </div>
            </div>
            <div>
                {milestone.activities.map(({ activityHash, phases }) => (
                    <div key={activityHash}>
                        <h5>{strings.difficulty[raidTupleFromHash(String(activityHash))[1]]}</h5>
                        <div
                            className={styles["progress-boxes"]}
                            style={{
                                gridTemplateColumns: `repeat(${
                                    milestone.activities[0].phases?.length ?? 0
                                }, 30px)`
                            }}>
                            {phases?.map(phase => (
                                <EncounterProgress key={phase.phaseHash} phase={phase} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function EncounterProgress({ phase }: { phase: DestinyMilestoneActivityPhase }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <rect
                width="20"
                height="20"
                stroke="var(--border)"
                strokeWidth={4}
                fill={phase.complete ? "#0CA51240" : "none"}
            />
        </svg>
    )
}
