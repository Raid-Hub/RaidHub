import { useMemo } from "react"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { Tag } from "~/models/tag"
import { type RaidHubInstanceExtended } from "~/services/raidhub/types"

export const usePGCRTags = (activity: RaidHubInstanceExtended | null) => {
    const { isChallengeMode } = useRaidHubManifest()
    return useMemo(() => {
        if (!activity) return []

        const tags = new Array<{ tag: Tag; placement?: number | null }>()
        if (isChallengeMode(activity.versionId)) {
            tags.push({
                tag: Tag.CHALLENGE,
                placement: activity.leaderboardRank
            })
        } else if (activity.isDayOne) {
            const placement = isChallengeMode(activity.versionId) ? null : activity.leaderboardRank
            tags.push({ tag: Tag.DAY_ONE, placement })
        } else if (activity.isContest) {
            tags.push({ tag: Tag.CONTEST })
        }
        if (activity.fresh === false) tags.push({ tag: Tag.CHECKPOINT })
        if (activity.metadata.versionName === "Prestige") {
            tags.push({ tag: Tag.PRESTIGE, placement: activity.leaderboardRank })
        }
        if (activity.metadata.versionName === "Master") {
            tags.push({ tag: Tag.MASTER, placement: activity.leaderboardRank })
        }
        if (activity.metadata.versionName === "Guided Games") tags.push({ tag: Tag.GUIDEDGAMES })
        if (activity.playerCount === 1) tags.push({ tag: Tag.SOLO })
        else if (activity.playerCount === 2) tags.push({ tag: Tag.DUO })
        else if (activity.playerCount === 3) tags.push({ tag: Tag.TRIO })
        if (activity.flawless) tags.push({ tag: Tag.FLAWLESS })
        return tags
    }, [activity, isChallengeMode])
}
