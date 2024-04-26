import type { Collection } from "@discordjs/collection"
import { useCallback, useMemo } from "react"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { Raid } from "~/data/raid"
import type { ListedRaid, RaidHubPlayerActivitiesActivity } from "~/services/raidhub/types"
import { includedIn } from "~/util/helpers"

export const useTags = (activities: Collection<string, RaidHubPlayerActivitiesActivity>) => {
    const getWeight = useGetWeight()

    return useMemo(() => {
        const sorted = activities
            .filter(a => a.player.completed)
            .map(activity => ({
                activity,
                weight: getWeight(activity)
            }))
            .filter(
                a =>
                    !isIllegalTag({
                        raid: a.activity.meta.activityId,
                        weight: a.weight
                    })
            )
            .sort(
                (a, b) =>
                    b.weight - a.weight ||
                    (new Date(a.activity.dateCompleted) < new Date(b.activity.dateCompleted)
                        ? -1
                        : 1)
            )

        let bitfield = 0
        let bitfieldForElevatedDifficulty = 0
        const result = new Array<{
            activity: RaidHubPlayerActivitiesActivity
            bestPossible: boolean
        }>()
        for (const { activity, weight } of sorted) {
            const isElevatedDifficulty = weight % 2 == 1
            const covers = isElevatedDifficulty
                ? weight & ~bitfieldForElevatedDifficulty
                : weight & ~bitfield

            if (covers) {
                if (isElevatedDifficulty) {
                    bitfieldForElevatedDifficulty = bitfieldForElevatedDifficulty | weight
                }
                bitfield = bitfield | weight

                result.push({
                    activity,
                    bestPossible: isBestTag({ raid: activity.meta.activityId, weight })
                })
                if (result.length >= 3) break
            }
        }

        return result
    }, [activities, getWeight])
}

const useGetWeight = () => {
    const { elevatedRaidDifficulties } = useRaidHubManifest()

    return useCallback(
        (activity: RaidHubPlayerActivitiesActivity) => {
            // non lowman 2 => 1 => 0
            // trio => 2 => 1
            // duo => 4 => 3
            // solo => 8 => 7
            const adjustedPlayerCount =
                (1 << Math.max(0, 4 - Math.min(activity.playerCount, 6))) - 1
            const isElevatedDifficulty = includedIn(
                elevatedRaidDifficulties,
                activity.meta.versionId
            )
            /*
        This is a bitfield to measure the weight of an activity. If its not flawless or a lowman, it has 0 weight.
        From the right,
        - bit 0 is for master/prestige.
        - bit 1 for fresh
        - bit 2 for flawless
        - bit 3,4,5 for trio, duo, and solo respectively
        */
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            return activity.completed && (activity.flawless || activity.playerCount <= 3)
                ? (adjustedPlayerCount << 3) +
                      ((activity.flawless ? 1 : 0) << 2) +
                      ((activity.fresh ? 1 : 0) << 1) +
                      +isElevatedDifficulty
                : 0
        },
        [elevatedRaidDifficulties]
    )
}

function isIllegalTag(activity: { raid: ListedRaid; weight: number }): boolean {
    switch (activity.raid) {
        case Raid.CROTAS_END:
            // solo
            return bitfieldMatches(activity.weight, 0b111000)
        case Raid.VOW_OF_THE_DISCIPLE:
            // duo
            return bitfieldMatches(activity.weight, 0b011000)
        case Raid.DEEP_STONE_CRYPT:
            // solo
            return bitfieldMatches(activity.weight, 0b111000)
        case Raid.GARDEN_OF_SALVATION:
            // duo fresh
            return bitfieldMatches(activity.weight, 0b011010)
        case Raid.CROWN_OF_SORROW:
            // solo
            return bitfieldMatches(activity.weight, 0b111000)
        case Raid.SCOURGE_OF_THE_PAST:
            // duo flawless or solo
            return (
                bitfieldMatches(activity.weight, 0b111000) ||
                bitfieldMatches(activity.weight, 0b011100)
            )
        case Raid.LAST_WISH:
            // duo flawless
            return bitfieldMatches(activity.weight, 0b011100)
        case Raid.SPIRE_OF_STARS:
            // any lowman
            return bitfieldMatches(activity.weight, 0b001000)
        case Raid.EATER_OF_WORLDS:
            // any fresh lowman
            return bitfieldMatches(activity.weight, 0b001010)
        case Raid.LEVIATHAN:
            // any fresh lowman
            return bitfieldMatches(activity.weight, 0b001010)
        default:
            return false
    }
}

function isBestTag(activity: { raid: ListedRaid; weight: number }): boolean {
    switch (activity.raid) {
        case Raid.CROTAS_END:
            // duo flawless or trio flawless master
            return (
                bitfieldMatches(activity.weight, 0b111000) ||
                bitfieldMatches(activity.weight, 0b011110) ||
                bitfieldMatches(activity.weight, 0b001111)
            )

        case Raid.ROOT_OF_NIGHTMARES:
            // solo flawless or duo flawless master
            return (
                bitfieldMatches(activity.weight, 0b111110) ||
                bitfieldMatches(activity.weight, 0b011111)
            )
        case Raid.KINGS_FALL:
            // duo master oryx or trio flawless master
            return (
                bitfieldMatches(activity.weight, 0b011001) ||
                bitfieldMatches(activity.weight, 0b001111)
            )
        case Raid.VOW_OF_THE_DISCIPLE:
            // trio flawless master
            return bitfieldMatches(activity.weight, 0b001111)
        case Raid.VAULT_OF_GLASS:
            // solo atheon or duo flawless master
            return (
                bitfieldMatches(activity.weight, 0b111000) ||
                bitfieldMatches(activity.weight, 0b011111)
            )
        case Raid.DEEP_STONE_CRYPT:
            // duo flawless
            return bitfieldMatches(activity.weight, 0b011110)
        case Raid.GARDEN_OF_SALVATION:
            // solo sanc or trio flawless
            return (
                bitfieldMatches(activity.weight, 0b111000) ||
                bitfieldMatches(activity.weight, 0b001110)
            )
        case Raid.CROWN_OF_SORROW:
            // duo flawless
            return bitfieldMatches(activity.weight, 0b011110)
        case Raid.SCOURGE_OF_THE_PAST:
            // duo insurrection or trio flawless
            return (
                bitfieldMatches(activity.weight, 0b011000) ||
                bitfieldMatches(activity.weight, 0b001110)
            )
        case Raid.LAST_WISH:
            // solo queens or trio flawless
            return (
                bitfieldMatches(activity.weight, 0b111000) ||
                bitfieldMatches(activity.weight, 0b001110)
            )
        case Raid.SPIRE_OF_STARS:
            // flawless prestige :(
            return bitfieldMatches(activity.weight, 0b000111)
        case Raid.EATER_OF_WORLDS:
            // solo argos
            return bitfieldMatches(activity.weight, 0b111000)
        case Raid.LEVIATHAN:
            // duo calus
            return bitfieldMatches(activity.weight, 0b011000)
        default:
            return false
    }
}

function bitfieldMatches(a: number, compareTo: number) {
    return (a & compareTo) === compareTo
}
