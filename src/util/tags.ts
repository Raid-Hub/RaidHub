import { LocalStrings, LocalizedStrings } from "./localized-strings"
import { Raid } from "./raid"

export enum Tag {
    CHECKPOINT,
    DAY_ONE,
    CONTEST,
    MASTER,
    PRESTIGE,
    SOLO,
    DUO,
    TRIO,
    FLAWLESS,
    CHALLENGE_VOG,
    CHALLENGE_KF,
    ABILITIES_ONLY,
}

export function addModifiers(
    raid: Raid,
    modifiers: Tag[],
    strings: LocalStrings,
): string {
    const result: string[] = []
    if (modifiers.includes(Tag.ABILITIES_ONLY))
        result.push(strings.tags[Tag.ABILITIES_ONLY])

    if (modifiers.includes(Tag.SOLO)) result.push(strings.tags[Tag.SOLO])
    else if (modifiers.includes(Tag.DUO)) result.push(strings.tags[Tag.SOLO])
    else if (modifiers.includes(Tag.TRIO)) result.push(strings.tags[Tag.SOLO])

    if (modifiers.includes(Tag.FLAWLESS))
        result.push(strings.tags[Tag.FLAWLESS])

    if (modifiers.includes(Tag.DAY_ONE)) result.push(strings.tags[Tag.DAY_ONE])

    if (modifiers.includes(Tag.MASTER)) result.push(strings.tags[Tag.MASTER])
    else if (modifiers.includes(Tag.PRESTIGE))
        result.push(strings.tags[Tag.PRESTIGE])
    else if (modifiers.includes(Tag.CONTEST))
        result.push(strings.tags[Tag.CONTEST])

    result.push(strings.raidNames[raid])

    if (modifiers.includes(Tag.CHECKPOINT))
        result.push(`(${strings.tags[Tag.CHECKPOINT]})`)

    return result.join(" ")
}
