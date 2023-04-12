import { DestinyClass } from "oodestiny/schemas"

export const CharacterType: { [key: string]: DestinyClass } = {
    Hunter: DestinyClass.Hunter,
    Titan: DestinyClass.Titan,
    Warlock: DestinyClass.Warlock,
    "": DestinyClass.Unknown,
    Unknown: DestinyClass.Unknown
}

export const CharacterName: { [key in DestinyClass]: string } = {
    [DestinyClass.Hunter]: "Hunter",
    [DestinyClass.Titan]: "Titan",
    [DestinyClass.Warlock]: "Warlock",
    [DestinyClass.Unknown]: "Unknown"
}

export const CharacterLogos: { [key in DestinyClass]: string } = {
    [DestinyClass.Hunter]: "/icons/hunter.png",
    [DestinyClass.Titan]: "/icons/titan.png",
    [DestinyClass.Warlock]: "/icons/warlock.png",
    [DestinyClass.Unknown]: "/icons/question_mark.png"
}
