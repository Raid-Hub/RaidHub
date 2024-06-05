"use client"

import type { ProfileProps } from "~/app/(profile)/types"
import { useRaidHubManifest } from "~/app/layout/managers"
import { usePageProps } from "~/components/layout/PageWrapper"
import { useProfile } from "~/services/bungie/hooks"
import CharacterWeeklyProgress from "./CharacterWeeklyProgress"
import styles from "./expanded-raid.module.css"

/**@deprecated */
export default function WeeklyProgress({ raid }: { raid: number }) {
    const { getActivityDefinition } = useRaidHubManifest()
    const { destinyMembershipId, destinyMembershipType } = usePageProps<ProfileProps>()
    const { data: profile } = useProfile(
        {
            destinyMembershipId,
            membershipType: destinyMembershipType
        },
        { staleTime: 3 * 60000 }
    )

    const milestone = getActivityDefinition(raid)?.milestoneHash
    if (
        profile &&
        !profile.characterProgressions?.disabled &&
        profile.characterProgressions?.data == undefined
    ) {
        return <div className={styles["weekly-progress"]}>Private profile</div>
    }

    if (!milestone) {
        return <div className={styles["weekly-progress"]}>No milestone</div>
    }

    const entries = Object.entries(profile?.characterProgressions?.data ?? {})

    return (
        !!entries.length &&
        !!Object.keys(profile?.characters.data ?? {}).length && (
            <div>
                <h3>Weekly Progress</h3>
                <div className={styles["weekly-progress"]}>
                    {entries.map(
                        ([characterId, { milestones }]) =>
                            profile?.characters.data?.[characterId] &&
                            milestones[Number(milestone)] && (
                                <CharacterWeeklyProgress
                                    key={characterId}
                                    character={profile.characters.data[characterId]}
                                    milestone={milestones[Number(milestone)]}
                                />
                            )
                    )}
                </div>
            </div>
        )
    )
}
