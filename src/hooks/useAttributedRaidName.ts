import { useMemo } from "react"
import { Difficulty, Raid } from "~/data/raid"
import { useRaidHubManifest } from "~/layout/managers/RaidHubManifestManager"
import { Tag } from "~/models/tag"
import type { ListedRaid, RaidDifficulty } from "~/services/raidhub/types"

// todo
export const useAttributedRaidName = (
    tag: {
        raid: ListedRaid
        playerCount: number
        fresh: boolean | null
        flawless: boolean | null
        difficulty: RaidDifficulty
        contest: boolean
    },
    opts?: {
        includeFresh?: boolean
        excludeRaidName?: boolean
    }
): string | null => {
    const { getCheckpointName, getRaidString } = useRaidHubManifest()

    return useMemo(() => {
        const wishWall = tag.raid === Raid.LAST_WISH && tag.playerCount <= 2 && tag.fresh
        const descriptors: string[] = []
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
        if (tag.difficulty === Difficulty.MASTER) descriptors.push(Tag.MASTER)
        else if (tag.contest) descriptors.push(Tag.CONTEST)
        if (tag.fresh === false) descriptors.push(getCheckpointName(tag.raid))
        let str = descriptors.join(" ")

        if (!opts?.excludeRaidName) {
            str = `${str} ${getRaidString(tag.raid)}`
        }
        // special cases
        if (wishWall) str += " (Wish Wall)"
        if (tag.fresh === null) str += "*"
        return str
    }, [tag, getCheckpointName, opts?.excludeRaidName, opts?.includeFresh, getRaidString])
}
