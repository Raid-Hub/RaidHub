import { Difficulty, Raid } from "~/data/raid"
import type Activity from "~/models/profile/data/Activity"

export enum Tag {
    CHECKPOINT,
    SOLO,
    DUO,
    TRIO,
    DAY_ONE,
    CONTEST,
    WEEK_ONE,
    MASTER,
    PRESTIGE,
    FLAWLESS,
    CHALLENGE_VOG,
    CHALLENGE_KF,
    CHALLENGE_CROTA,
    ABILITIES_ONLY,
    FRESH,
    GUIDEDGAMES
}

export const TagForReprisedContest = {
    [Difficulty.CHALLENGE_VOG]: Tag.CHALLENGE_VOG,
    [Difficulty.CHALLENGE_KF]: Tag.CHALLENGE_KF,
    [Difficulty.CHALLENGE_CROTA]: Tag.CHALLENGE_CROTA
}

export function findTags(activities: Activity[]) {
    const sorted = activities
        .filter(a => a.player.finishedRaid)
        .sort(
            (a, b) => b.weight - a.weight || a.dateCompleted.getTime() - b.dateCompleted.getTime()
        )

    let bitfield = 0
    const result = new Array<Activity & { bestPossible: boolean }>()
    for (const activity of sorted) {
        const covers = activity.weight & ~bitfield
        if (covers) {
            bitfield = activity.weight | bitfield
            result.push({ ...activity, bestPossible: isBestTag(activity) })
            if (result.length >= 3) break
        }
    }

    return result
}

export function isBestTag(activity: Activity): boolean {
    switch (activity.raid) {
        case Raid.CROTAS_END:
            // solo crota or duo flawless or trio flawless master
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
            // solo flawless vog or duo flawless master
            return (
                bitfieldMatches(activity.weight, 0b111110) ||
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
            // solo prestige argos
            return bitfieldMatches(activity.weight, 0b111001)
        case Raid.LEVIATHAN:
            // duo prestige calus
            return bitfieldMatches(activity.weight, 0b011001)
        default:
            return false
    }
}

function bitfieldMatches(a: number, compareTo: number) {
    return (a & compareTo) === compareTo
}
