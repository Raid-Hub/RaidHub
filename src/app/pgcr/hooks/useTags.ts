import { useMemo } from "react"
import { Difficulty } from "~/data/raid"
import { useRaidHubManifest } from "~/layout/managers/RaidHubManifestManager"
import { Tag, TagForReprisedContest } from "~/models/tag"
import type { RaidHubActivityResponse } from "~/services/raidhub/types"
import { includedIn } from "~/util/helpers"

export const useTags = (activity: RaidHubActivityResponse | null) => {
    const { listedRaids, reprisedRaids } = useRaidHubManifest()
    return useMemo(() => {
        if (!activity) return []
        if (!includedIn(listedRaids, activity.meta.raid)) return []

        const tags = new Array<{ tag: Tag; placement?: number }>()
        if (
            activity.contest &&
            includedIn(
                reprisedRaids.map(r => r.version),
                activity.meta.version
            )
        ) {
            const placement = activity.leaderboardEntries.challenge
            // @ts-expect-error - this is a valid value
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            tags.push({ tag: TagForReprisedContest[activity.meta.version], placement })
        }
        if (activity.dayOne) {
            const placement = !includedIn(
                reprisedRaids.map(r => r.version),
                activity.meta.version
            )
                ? activity.leaderboardEntries.normal
                : undefined
            tags.push({ tag: Tag.DAY_ONE, placement })
        }
        if (activity.contest) tags.push({ tag: Tag.CONTEST })
        if (activity.fresh === false) tags.push({ tag: Tag.CHECKPOINT })
        if (activity.meta.version === Difficulty.PRESTIGE) {
            const placement = activity.leaderboardEntries.prestige
            tags.push({ tag: Tag.PRESTIGE, placement })
        }
        if (activity.meta.version === Difficulty.MASTER) {
            const placement = activity.leaderboardEntries.master
            tags.push({ tag: Tag.MASTER, placement })
        }
        if (activity.meta.version === Difficulty.GUIDEDGAMES) tags.push({ tag: Tag.GUIDEDGAMES })
        if (activity.playerCount === 1) tags.push({ tag: Tag.SOLO })
        else if (activity.playerCount === 2) tags.push({ tag: Tag.DUO })
        else if (activity.playerCount === 3) tags.push({ tag: Tag.TRIO })
        if (activity.fresh && activity.completed) {
            if (activity.flawless) tags.push({ tag: Tag.FLAWLESS })
        }
        return tags
    }, [listedRaids, reprisedRaids, activity])
}
