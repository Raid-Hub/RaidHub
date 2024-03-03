"use client"

import type { ProfileProps } from "~/app/(profile)/types"
import { usePageProps } from "~/components/layout/PageWrapper"
import { RaidMileStones } from "~/data/milestones"
import { useProfile } from "~/services/bungie/hooks"
import type { ListedRaid, SunsetRaid } from "~/services/raidhub/types"
import CharacterWeeklyProgress from "./CharacterWeeklyProgress"
import styles from "./expanded-raid.module.css"

/**@deprecated */
export default function WeeklyProgress({ raid }: { raid: Exclude<ListedRaid, SunsetRaid> }) {
    const { destinyMembershipId, destinyMembershipType } = usePageProps<ProfileProps>()

    const { data: profile } = useProfile(
        {
            destinyMembershipId,
            membershipType: destinyMembershipType
        },
        { staleTime: 3 * 60000 }
    )

    const milestone = RaidMileStones[raid]
    if (
        profile &&
        !profile.characterProgressions?.disabled &&
        profile.characterProgressions?.data == undefined
    ) {
        return <div className={styles["weekly-progress"]}>Private profile</div>
    }

    return (
        <div className={styles["weekly-progress"]}>
            {Object.entries(profile?.characterProgressions?.data ?? {}).map(
                ([characterId, { milestones }]) =>
                    profile?.characters.data?.[characterId] && (
                        <CharacterWeeklyProgress
                            key={characterId}
                            character={profile.characters.data[characterId]}
                            milestone={milestones[milestone]}
                        />
                    )
            )}
        </div>
    )
}
