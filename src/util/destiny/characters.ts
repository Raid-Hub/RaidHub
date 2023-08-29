import { StaticImageData } from "next/image"
import { Hunter, Question_Mark, Titan, Warlock } from "../../images/icons"
import { DestinyClass } from "bungie-net-core/models"

export const CharacterType: { [key: string]: DestinyClass } = {
    Titan: 0,
    Hunter: 1,
    Warlock: 2,
    "": 3,
    Unknown: 3
}

export const CharacterName: { [key in DestinyClass]: string } = {
    0: "Titan",
    1: "Hunter",
    2: "Warlock",
    3: "Unknown"
}

export const CharacterLogos: { [key in DestinyClass]: StaticImageData } = {
    0: Titan,
    1: Hunter,
    2: Warlock,
    3: Question_Mark
}
