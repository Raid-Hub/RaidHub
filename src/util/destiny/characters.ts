import { DestinyClass } from "bungie-net-core/lib/models"
import { StaticImageData } from "next/image"
import { Hunter, Question_Mark, Titan, Warlock } from "../../images/icons"

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

export const CharacterLogos: { [key in DestinyClass]: StaticImageData } = {
    [DestinyClass.Hunter]: Hunter,
    [DestinyClass.Titan]: Titan,
    [DestinyClass.Warlock]: Warlock,
    [DestinyClass.Unknown]: Question_Mark
}
