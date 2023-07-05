import { DestinyClass } from "bungie-net-core/lib/models"
import { Icons } from "../presentation/icons"

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
    [DestinyClass.Hunter]: Icons.HUNTER,
    [DestinyClass.Titan]: Icons.TITAN,
    [DestinyClass.Warlock]: Icons.WARLOCK,
    [DestinyClass.Unknown]: Icons.UNKNOWN
}