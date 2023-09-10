import { DestinyClass } from "bungie-net-core/models"
import { StaticImageData } from "next/image"
import { Hunter, Question_Mark, Titan, Warlock } from "./icons"

export const CharacterLogos: { [key in DestinyClass]: StaticImageData } = {
    0: Titan,
    1: Hunter,
    2: Warlock,
    3: Question_Mark
}
