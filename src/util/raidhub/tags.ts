import { LocalStrings } from "../presentation/localized-strings"
import {
    Difficulty,
    Raid,
    ReprisedContestDifficultyDictionary,
    ReprisedContestRaidDifficulties,
    ReprisedRaid
} from "~/types/raids"
import Activity from "~/models/profile/data/Activity"
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

export const TagForReprisedContest: Record<(typeof ReprisedContestRaidDifficulties)[number], Tag> =
    {
        [Difficulty.CHALLENGE_VOG]: Tag.CHALLENGE_VOG,
        [Difficulty.CHALLENGE_KF]: Tag.CHALLENGE_KF,
        [Difficulty.CHALLENGE_CROTA]: Tag.CHALLENGE_CROTA
    }

export function wfRaceMode({
    challenge,
    raid,
    dayOne,
    contest,
    weekOne
}: {
    raid: Raid
    dayOne: boolean | undefined
    challenge: boolean | undefined
    contest: boolean | undefined
    weekOne: boolean | undefined
}): Tag | null {
    if (challenge) {
        return TagForReprisedContest[ReprisedContestDifficultyDictionary[raid as ReprisedRaid]]
    } else if (dayOne) {
        return Tag.DAY_ONE
    } else if (contest) {
        return Tag.CONTEST
    } else if (weekOne) {
        return Tag.WEEK_ONE
    } else {
        return null
    }
}

export function findTags(activities: Activity[]) {
    const sorted = activities
        .filter(a => a.didMemberComplete)
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

export function addModifiers(
    raid: Raid,
    tagModifiers: { tag: Tag; placement?: number }[],
    strings: LocalStrings
): string {
    const result: string[] = []
    const modifiers = tagModifiers.map(m => m.tag)
    if (modifiers.includes(Tag.ABILITIES_ONLY)) result.push(strings.tags[Tag.ABILITIES_ONLY])

    if (modifiers.includes(Tag.SOLO)) result.push(strings.tags[Tag.SOLO])
    else if (modifiers.includes(Tag.DUO)) result.push(strings.tags[Tag.DUO])
    else if (modifiers.includes(Tag.TRIO)) result.push(strings.tags[Tag.TRIO])

    if (modifiers.includes(Tag.FLAWLESS)) result.push(strings.tags[Tag.FLAWLESS])

    if (modifiers.includes(Tag.DAY_ONE)) result.push(strings.tags[Tag.DAY_ONE])

    if (modifiers.includes(Tag.MASTER)) result.push(strings.tags[Tag.MASTER])
    else if (modifiers.includes(Tag.PRESTIGE)) result.push(strings.tags[Tag.PRESTIGE])
    else if (modifiers.includes(Tag.CONTEST)) result.push(strings.tags[Tag.CONTEST])

    result.push(strings.raidNames[raid])

    if (modifiers.includes(Tag.CHECKPOINT)) result.push(`(${strings.tags[Tag.CHECKPOINT]})`)

    return result.join(" ")
}
