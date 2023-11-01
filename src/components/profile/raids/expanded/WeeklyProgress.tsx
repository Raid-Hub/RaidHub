import { useBungieClient } from "~/components/app/TokenManager"
import { RaidMileStones } from "~/data/milestones"
import { ListedRaid, SunsetRaid } from "~/types/raids"
import { useProfileProps } from "~/components/profile/Profile"
import CharacterWeeklyProgress from "./CharacterWeeklyProgress"
import styles from "./expanded-raid.module.css"

export default function WeeklyProgress({ raid }: { raid: Exclude<ListedRaid, SunsetRaid> }) {
    const { destinyMembershipId, destinyMembershipType } = useProfileProps()
    const bungie = useBungieClient()

    const { data: profile } = bungie.profile.useQuery(
        {
            destinyMembershipId,
            membershipType: destinyMembershipType
        },
        { staleTime: 3 * 60000 }
    )

    const milestone = RaidMileStones[raid]
    if (
        profile &&
        profile.characterProgressions.disabled !== true &&
        profile.characterProgressions.data == undefined
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
