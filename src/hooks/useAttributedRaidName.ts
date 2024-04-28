import { useMemo } from "react"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { Difficulty, Raid } from "~/data/raid"
import { Tag } from "~/models/tag"
import type { ActivityId, RaidDifficulty } from "~/services/raidhub/types"

export const useAttributedRaidName = (
    tag: {
        raid: ActivityId
        playerCount: number
        fresh: boolean | null
        flawless: boolean | null
        difficulty: RaidDifficulty
        contest: boolean
        completed: boolean
    },
    opts?: {
        includeFresh?: boolean
        excludeRaidName?: boolean
    }
): string | null => {
    const { getCheckpointName, getRaidString } = useRaidHubManifest()

    return useMemo(() => {
        const wishWall =
            tag.raid === Raid.LAST_WISH && tag.playerCount <= 2 && tag.fresh && tag.completed
        const descriptors: string[] = []
        if (tag.completed) {
            if (tag.fresh && !tag.flawless && opts?.includeFresh) descriptors.push(Tag.FRESH)
            switch (tag.playerCount) {
                case 1:
                    descriptors.push(Tag.SOLO)
                    break
                case 2:
                    descriptors.push(Tag.DUO)
                    break
                case 3:
                    descriptors.push(Tag.TRIO)
                    break
            }
            if (tag.flawless) descriptors.push(Tag.FLAWLESS)
        }
        if (tag.difficulty === Difficulty.MASTER) descriptors.push(Tag.MASTER)
        else if (tag.contest) descriptors.push(Tag.CONTEST)
        if (!tag.fresh && tag.completed && tag.playerCount <= 3) {
            descriptors.push(getCheckpointName(tag.raid))
        }
        if (!opts?.excludeRaidName) {
            descriptors.push(getRaidString(tag.raid))
        }
        // special cases
        if (wishWall) {
            descriptors.push("(Wish Wall)")
        } else if (!tag.fresh && tag.playerCount > 3) {
            descriptors.push("(Checkpoint)")
        }
        return descriptors.join(" ")
    }, [tag, getCheckpointName, opts?.excludeRaidName, opts?.includeFresh, getRaidString])
}
