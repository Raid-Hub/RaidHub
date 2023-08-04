import { LocalStrings } from "../presentation/localized-strings"
import {
    Difficulty,
    Raid,
    RaidsWithReprisedContest,
    ReprisedContestDifficultyDictionary,
    ReprisedContestRaidDifficulties,
    ReprisedRaid
} from "../../types/raids"
import { LowManActivity } from "../../types/profile"

export enum Tag {
    CHECKPOINT,
    DAY_ONE,
    CONTEST,
    WEEK_ONE,
    MASTER,
    PRESTIGE,
    SOLO,
    DUO,
    TRIO,
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

export function isBestTag(activity: LowManActivity, raid: Raid): boolean {
    switch (raid) {
        case Raid.ROOT_OF_NIGHTMARES:
            // solo flawless or duo flawless master
            return (
                (activity.playerCount === 1 && activity.flawless) ||
                (activity.difficulty === Difficulty.MASTER &&
                    activity.playerCount === 2 &&
                    activity.flawless &&
                    !!activity.fresh)
            )
        case Raid.KINGS_FALL:
            // duo master oryx or trio flawless master
            return (
                (activity.playerCount === 2 && activity.difficulty === Difficulty.MASTER) ||
                (activity.difficulty === Difficulty.MASTER &&
                    activity.playerCount === 3 &&
                    activity.flawless &&
                    !!activity.fresh)
            )
        case Raid.VOW_OF_THE_DISCIPLE:
            // trio flawless master
            return (
                activity.difficulty === Difficulty.MASTER &&
                activity.playerCount === 3 &&
                activity.flawless &&
                !!activity.fresh
            )
        case Raid.VAULT_OF_GLASS:
            // solo atheon or duo flawless master
            return (
                activity.playerCount === 1 ||
                (activity.difficulty === Difficulty.MASTER &&
                    activity.playerCount === 2 &&
                    activity.flawless &&
                    !!activity.fresh)
            )
        case Raid.DEEP_STONE_CRYPT:
            // duo flawless
            return activity.playerCount === 2 && activity.flawless && !!activity.fresh

        case Raid.GARDEN_OF_SALVATION:
            // duo sanc or trio flawless
            return (
                activity.playerCount === 2 ||
                (activity.playerCount === 3 && activity.flawless && !!activity.fresh)
            )
        case Raid.CROWN_OF_SORROW:
            // duo flawless
            return activity.playerCount === 2 && activity.flawless && !!activity.fresh
        case Raid.SCOURGE_OF_THE_PAST:
            // duo insurrection or trio flawless
            return (
                activity.playerCount === 2 ||
                (activity.playerCount === 3 && activity.flawless && !!activity.fresh)
            )
        case Raid.LAST_WISH:
            // solo queens or trio flawless
            return (
                activity.playerCount === 1 ||
                (activity.playerCount === 3 && activity.flawless && !!activity.fresh)
            )
        case Raid.SPIRE_OF_STARS:
            // :(
            return (
                activity.flawless && !!activity.fresh && activity.difficulty === Difficulty.PRESTIGE
            )
        case Raid.EATER_OF_WORLDS:
            // solo prestige argos
            return (
                (activity.playerCount === 1 && activity.difficulty === Difficulty.PRESTIGE) ||
                (activity.flawless &&
                    !!activity.fresh &&
                    activity.difficulty === Difficulty.PRESTIGE)
            )
        case Raid.LEVIATHAN:
            // duo prestige calus
            return (
                (activity.playerCount === 2 && activity.difficulty === Difficulty.PRESTIGE) ||
                (activity.flawless &&
                    !!activity.fresh &&
                    activity.difficulty === Difficulty.PRESTIGE)
            )
        default:
            return false
    }
}

export function addModifiers(raid: Raid, modifiers: Tag[], strings: LocalStrings): string {
    const result: string[] = []
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
