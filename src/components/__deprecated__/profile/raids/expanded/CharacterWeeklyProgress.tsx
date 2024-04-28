import type {
    DestinyCharacterComponent,
    DestinyMilestone,
    DestinyMilestoneActivityPhase,
    DestinyMilestoneChallengeActivity
} from "bungie-net-core/models"
import Image from "next/image"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { useClassDefinition } from "~/hooks/dexie"
import { bungieIconUrl } from "~/util/destiny"
import styles from "./expanded-raid.module.css"

/**@deprecated */
export default function CharacterWeeklyProgress({
    character,
    milestone
}: {
    character: DestinyCharacterComponent
    milestone: DestinyMilestone
}) {
    const classDefinition = useClassDefinition(character.classHash)
    return (
        <div style={{ border: "1px solid var(--border)", padding: "1em" }}>
            <div className={styles["character-progress-header"]}>
                <h4>{classDefinition?.displayProperties.name}</h4>
                <div className={styles["image-container"]}>
                    <Image src={bungieIconUrl(character.emblemPath)} alt="" fill unoptimized />
                </div>
            </div>
            <div>
                {milestone.activities.map(a => (
                    <MilestoneActivity key={a.activityHash} activity={a} />
                ))}
            </div>
        </div>
    )
}

function MilestoneActivity({ activity }: { activity: DestinyMilestoneChallengeActivity }) {
    const { getVersionString, getRaidFromHash } = useRaidHubManifest()
    const metaData = getRaidFromHash(activity.activityHash)
    if (!metaData) return null
    return (
        <div>
            <h5>{getVersionString(metaData.difficulty)}</h5>
            <div
                className={styles["progress-boxes"]}
                style={{
                    gridTemplateColumns: `repeat(${activity.phases?.length ?? 0}, 30px)`
                }}>
                {activity.phases?.map(phase => (
                    <EncounterProgress key={phase.phaseHash} phase={phase} />
                ))}
            </div>
        </div>
    )
}

function EncounterProgress({ phase }: { phase: DestinyMilestoneActivityPhase }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width={30} height={30}>
            <rect
                width={20}
                height={20}
                stroke="gray"
                strokeWidth={2}
                fill={phase.complete ? "#0CA51240" : "none"}
            />
        </svg>
    )
}
