import { Flatten } from "../../types/generic"
import { HTMLAttributes } from "react"
import RaidInfo from "../../models/pgcr/RaidInfo"
import { Tag } from "../raidhub/tags"

export const enum Raid {
    NA,
    LEVIATHAN,
    EATER_OF_WORLDS,
    SPIRE_OF_STARS,
    LAST_WISH,
    SCOURGE_OF_THE_PAST,
    CROWN_OF_SORROW,
    GARDEN_OF_SALVATION,
    DEEP_STONE_CRYPT,
    VAULT_OF_GLASS,
    VOW_OF_THE_DISCIPLE,
    KINGS_FALL,
    ROOT_OF_NIGHTMARES
}

export const AllRaids: Raid[] = [
    Raid.ROOT_OF_NIGHTMARES,
    Raid.KINGS_FALL,
    Raid.VOW_OF_THE_DISCIPLE,
    Raid.VAULT_OF_GLASS,
    Raid.DEEP_STONE_CRYPT,
    Raid.GARDEN_OF_SALVATION,
    Raid.LAST_WISH,
    Raid.CROWN_OF_SORROW,
    Raid.SCOURGE_OF_THE_PAST,
    Raid.SPIRE_OF_STARS,
    Raid.EATER_OF_WORLDS,
    Raid.LEVIATHAN
]

export const enum Difficulty {
    NORMAL,
    PRESTIGE,
    MASTER,
    CONTEST,
    CHALLENGEVOG,
    CHALLENGEKF
}

export const CommonRaidDifficulties: Difficulty[] = [
    Difficulty.NORMAL,
    Difficulty.PRESTIGE,
    Difficulty.MASTER
]

export const ContestRaidDifficulties: Difficulty[] = [
    Difficulty.CHALLENGEVOG,
    Difficulty.CHALLENGEKF
]

/**
 * This constant is where to start when new raid hashes should be added.
 * TypeScript will catch everything else and show you what else needs to be updated.
 */
export const RaidHashes = {
    [Raid.LEVIATHAN]: {
        [Difficulty.NORMAL]: [
            "89727599",
            "287649202",
            "1699948563",
            "1875726950",
            "2693136600",
            "2693136601",
            "2693136602",
            "2693136603",
            "2693136604",
            "2693136605",
            "3916343513",
            "4039317196"
        ] as const,
        [Difficulty.PRESTIGE]: [
            "417231112",
            "508802457",
            "757116822",
            "771164842",
            "1685065161",
            "1800508819",
            "2449714930",
            "3446541099",
            "4206123728",
            "3912437239",
            "3879860661",
            "3857338478"
        ] as const
    },
    [Raid.EATER_OF_WORLDS]: {
        [Difficulty.NORMAL]: ["2164432138", "3089205900"] as const,
        [Difficulty.PRESTIGE]: ["809170886"] as const
    },
    [Raid.SPIRE_OF_STARS]: {
        [Difficulty.NORMAL]: ["119944200", "3004605630"] as const,
        [Difficulty.PRESTIGE]: ["3213556450"] as const
    },
    [Raid.LAST_WISH]: { [Difficulty.NORMAL]: ["1661734046", "2122313384", "2214608157"] as const },
    [Raid.SCOURGE_OF_THE_PAST]: { [Difficulty.NORMAL]: ["2812525063", "548750096"] as const },
    [Raid.CROWN_OF_SORROW]: {
        [Difficulty.NORMAL]: ["960175301", "3333172150"] as const
    },
    [Raid.GARDEN_OF_SALVATION]: {
        [Difficulty.NORMAL]: ["2497200493", "2659723068", "3458480158", "3845997235"] as const
    },
    [Raid.DEEP_STONE_CRYPT]: {
        [Difficulty.NORMAL]: ["910380154", "3976949817"] as const
    },
    [Raid.VAULT_OF_GLASS]: {
        [Difficulty.NORMAL]: ["3711931140", "3881495763"] as const,
        [Difficulty.CHALLENGEVOG]: ["1485585878"] as const,
        [Difficulty.MASTER]: ["1681562271", "3022541210"] as const
    },
    [Raid.VOW_OF_THE_DISCIPLE]: {
        [Difficulty.NORMAL]: ["1441982566", "2906950631", "4156879541"] as const,
        [Difficulty.MASTER]: ["4217492330", "3889634515"] as const
    },
    [Raid.KINGS_FALL]: {
        [Difficulty.NORMAL]: ["1374392663", "2897223272"] as const,
        [Difficulty.CHALLENGEKF]: ["1063970578"] as const,
        [Difficulty.MASTER]: ["2964135793"] as const
    },
    [Raid.ROOT_OF_NIGHTMARES]: {
        [Difficulty.NORMAL]: ["1191701339", "2381413764"] as const,
        [Difficulty.MASTER]: ["2918919505"] as const
    },
    [Raid.NA]: { [Difficulty.NORMAL]: [] as const }
}

export type DifficultyForRaidType<R extends keyof typeof RaidHashes> =
    keyof (typeof RaidHashes)[R] extends Difficulty ? keyof (typeof RaidHashes)[R] : never

export type RaidHashesForRaidAndDifficulty<
    R extends Raid,
    D extends DifficultyForRaidType<R>
> = (typeof RaidHashes)[R][Extract<D, keyof (typeof RaidHashes)[R]>]

export type AllRaidHashesForRaid<R extends Raid> = Flatten<
    (typeof RaidHashes)[R][Extract<Difficulty, keyof (typeof RaidHashes)[R]>]
>

export type ValidRaidHash = {
    [R in Raid]: AllRaidHashesForRaid<R>
}[Raid]

export type RaidDifficultyTuple = [name: Raid, difficulty: Difficulty]

/** Do not edit this list first, edit the mappings first */
export const HashDictionary: {
    [K in ValidRaidHash]: RaidDifficultyTuple
} = {
    "89727599": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "287649202": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "1699948563": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "1875726950": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "2693136600": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "2693136601": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "2693136602": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "2693136603": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "2693136604": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "2693136605": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "3916343513": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "4039317196": [Raid.LEVIATHAN, Difficulty.NORMAL],
    "417231112": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "508802457": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "757116822": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "771164842": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "1685065161": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "1800508819": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "2449714930": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "3446541099": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "4206123728": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "3912437239": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "3879860661": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "3857338478": [Raid.LEVIATHAN, Difficulty.PRESTIGE],
    "2164432138": [Raid.EATER_OF_WORLDS, Difficulty.NORMAL],
    "3089205900": [Raid.EATER_OF_WORLDS, Difficulty.NORMAL],
    "809170886": [Raid.EATER_OF_WORLDS, Difficulty.PRESTIGE],
    "119944200": [Raid.SPIRE_OF_STARS, Difficulty.NORMAL],
    "3004605630": [Raid.SPIRE_OF_STARS, Difficulty.NORMAL],
    "3213556450": [Raid.SPIRE_OF_STARS, Difficulty.PRESTIGE],
    "1661734046": [Raid.LAST_WISH, Difficulty.NORMAL],
    "2122313384": [Raid.LAST_WISH, Difficulty.NORMAL],
    "2214608157": [Raid.LAST_WISH, Difficulty.NORMAL],
    "2812525063": [Raid.SCOURGE_OF_THE_PAST, Difficulty.NORMAL],
    "548750096": [Raid.SCOURGE_OF_THE_PAST, Difficulty.NORMAL],
    "960175301": [Raid.CROWN_OF_SORROW, Difficulty.NORMAL],
    "3333172150": [Raid.CROWN_OF_SORROW, Difficulty.NORMAL],
    "2497200493": [Raid.GARDEN_OF_SALVATION, Difficulty.NORMAL],
    "2659723068": [Raid.GARDEN_OF_SALVATION, Difficulty.NORMAL],
    "3458480158": [Raid.GARDEN_OF_SALVATION, Difficulty.NORMAL],
    "3845997235": [Raid.GARDEN_OF_SALVATION, Difficulty.NORMAL],
    "910380154": [Raid.DEEP_STONE_CRYPT, Difficulty.NORMAL],
    "3976949817": [Raid.DEEP_STONE_CRYPT, Difficulty.NORMAL],
    "3711931140": [Raid.VAULT_OF_GLASS, Difficulty.NORMAL],
    "3881495763": [Raid.VAULT_OF_GLASS, Difficulty.NORMAL],
    "1485585878": [Raid.VAULT_OF_GLASS, Difficulty.CHALLENGEVOG],
    "1681562271": [Raid.VAULT_OF_GLASS, Difficulty.MASTER],
    "3022541210": [Raid.VAULT_OF_GLASS, Difficulty.MASTER],
    "1441982566": [Raid.VOW_OF_THE_DISCIPLE, Difficulty.NORMAL],
    "2906950631": [Raid.VOW_OF_THE_DISCIPLE, Difficulty.NORMAL],
    "4156879541": [Raid.VOW_OF_THE_DISCIPLE, Difficulty.NORMAL],
    "4217492330": [Raid.VOW_OF_THE_DISCIPLE, Difficulty.MASTER],
    "3889634515": [Raid.VOW_OF_THE_DISCIPLE, Difficulty.MASTER],
    "1374392663": [Raid.KINGS_FALL, Difficulty.NORMAL],
    "2897223272": [Raid.KINGS_FALL, Difficulty.NORMAL],
    "2964135793": [Raid.KINGS_FALL, Difficulty.MASTER],
    "1063970578": [Raid.KINGS_FALL, Difficulty.CHALLENGEKF],
    "1191701339": [Raid.ROOT_OF_NIGHTMARES, Difficulty.NORMAL],
    "2381413764": [Raid.ROOT_OF_NIGHTMARES, Difficulty.NORMAL],
    "2918919505": [Raid.ROOT_OF_NIGHTMARES, Difficulty.MASTER]
}

export const AllValidHashes = Object.keys(HashDictionary) as ValidRaidHash[]

export function raidDetailsFromHash(hash: string): RaidInfo {
    return new RaidInfo(HashDictionary[hash as ValidRaidHash] ?? [Raid.NA, Difficulty.NORMAL])
}

export function wfRaceMode(raid: Raid): Tag {
    if (raid === Raid.KINGS_FALL) return Tag.CHALLENGE_KF
    else if (raid === Raid.VAULT_OF_GLASS) return Tag.CHALLENGE_VOG
    else return Tag.DAY_ONE
}

export const RaidCardBackground: { [key in Raid]: string } = {
    [Raid.LEVIATHAN]: "/card-backgrounds/levi.png",
    [Raid.EATER_OF_WORLDS]: "/card-backgrounds/eow.png",
    [Raid.SPIRE_OF_STARS]: "/card-backgrounds/spire.png",
    [Raid.LAST_WISH]: "/card-backgrounds/wish.png",
    [Raid.SCOURGE_OF_THE_PAST]: "/card-backgrounds/sotp.png",
    [Raid.CROWN_OF_SORROW]: "/card-backgrounds/crown.png",
    [Raid.GARDEN_OF_SALVATION]: "/card-backgrounds/gos.png",
    [Raid.DEEP_STONE_CRYPT]: "/card-backgrounds/dsc.png",
    [Raid.VAULT_OF_GLASS]: "/card-backgrounds/vog.png",
    [Raid.VOW_OF_THE_DISCIPLE]: "/card-backgrounds/vow.png",
    [Raid.KINGS_FALL]: "/card-backgrounds/kf.png",
    [Raid.ROOT_OF_NIGHTMARES]: "/card-backgrounds/ron.png",
    [Raid.NA]: "/card-backgrounds/dne.png"
}

export const Backdrop: {
    [key in Raid]: HTMLAttributes<HTMLDivElement>["style"]
} = {
    [Raid.LEVIATHAN]: {
        backgroundImage: `url(${RaidCardBackground[Raid.LEVIATHAN]})`,
        opacity: 0.4
    },
    [Raid.EATER_OF_WORLDS]: {
        backgroundImage: `url(${RaidCardBackground[Raid.EATER_OF_WORLDS]})`,
        opacity: 0.4
    },
    [Raid.SPIRE_OF_STARS]: {
        backgroundImage: `url(${RaidCardBackground[Raid.SPIRE_OF_STARS]})`,
        opacity: 0.4
    },
    [Raid.LAST_WISH]: {
        backgroundImage: `url(${RaidCardBackground[Raid.LAST_WISH]})`,
        opacity: 0.2
    },
    [Raid.SCOURGE_OF_THE_PAST]: {
        backgroundImage: `url(${RaidCardBackground[Raid.SCOURGE_OF_THE_PAST]})`,
        opacity: 0.4
    },
    [Raid.CROWN_OF_SORROW]: {
        backgroundImage: `url(${RaidCardBackground[Raid.CROWN_OF_SORROW]})`,
        opacity: 0.4
    },
    [Raid.GARDEN_OF_SALVATION]: {
        backgroundImage: `url(${RaidCardBackground[Raid.GARDEN_OF_SALVATION]})`,
        opacity: 0.4
    },
    [Raid.DEEP_STONE_CRYPT]: {
        backgroundImage: `url(${RaidCardBackground[Raid.DEEP_STONE_CRYPT]})`,
        opacity: 0.8
    },
    [Raid.VAULT_OF_GLASS]: {
        backgroundImage: `url(${RaidCardBackground[Raid.VAULT_OF_GLASS]})`,
        opacity: 0.4
    },
    [Raid.VOW_OF_THE_DISCIPLE]: {
        backgroundImage: `url(${RaidCardBackground[Raid.VOW_OF_THE_DISCIPLE]})`,
        opacity: 0.4
    },
    [Raid.KINGS_FALL]: {
        backgroundImage: `url(${RaidCardBackground[Raid.KINGS_FALL]})`,
        opacity: 0.4
    },
    [Raid.ROOT_OF_NIGHTMARES]: {
        backgroundImage: `url(${RaidCardBackground[Raid.ROOT_OF_NIGHTMARES]})`,
        opacity: 0.6
    },
    [Raid.NA]: {
        backgroundImage: `url(${RaidCardBackground[Raid.NA]})`,
        opacity: 0.4
    }
}

export const RaidBanner: { [key in Raid]: string } = {
    [Raid.LEVIATHAN]: "/banners/levi.png",
    [Raid.EATER_OF_WORLDS]: "/banners/eow.png",
    [Raid.SPIRE_OF_STARS]: "/banners/spire.png",
    [Raid.LAST_WISH]: "/banners/wish.png",
    [Raid.SCOURGE_OF_THE_PAST]: "/banners/sotp.png",
    [Raid.CROWN_OF_SORROW]: "/banners/crown.png",
    [Raid.GARDEN_OF_SALVATION]: "/banners/gos.png",
    [Raid.DEEP_STONE_CRYPT]: "/banners/dsc.png",
    [Raid.VAULT_OF_GLASS]: "/banners/vog.png",
    [Raid.VOW_OF_THE_DISCIPLE]: "/banners/vow.png",
    [Raid.KINGS_FALL]: "/banners/kf.png",
    [Raid.ROOT_OF_NIGHTMARES]: "/banners/ron.png",
    [Raid.NA]: ""
}

export const ContestEnd: Partial<Record<Raid, Date>> = {
    [Raid.CROWN_OF_SORROW]: new Date("June 5, 2019 4:00:00 PM PDT"),
    [Raid.GARDEN_OF_SALVATION]: new Date("October 6, 2019 10:00:00 AM PDT"),
    [Raid.DEEP_STONE_CRYPT]: new Date("November 22, 2020 10:00:00 AM PST"),
    [Raid.VAULT_OF_GLASS]: new Date("May 23, 2021 10:00:00 AM PDT"),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date("March 7, 2022 10:00:00 AM PST"),
    [Raid.KINGS_FALL]: new Date("August 27, 2022 10:00:00 AM PDT"),
    [Raid.ROOT_OF_NIGHTMARES]: new Date("March 12, 2023 9:00:00 AM PST")
}

export const DayOneEnd: Partial<Record<Raid, Date>> = {
    [Raid.LEVIATHAN]: new Date("September 14, 2017 10:00:00 AM PDT"),
    [Raid.EATER_OF_WORLDS]: new Date("December 9th, 2017 10:00:00 AM PST"),
    [Raid.SPIRE_OF_STARS]: new Date("May 12, 2018 10:00:00 AM PDT"),
    [Raid.LAST_WISH]: new Date("September 15, 2018 10:00:00 AM PDT"),
    [Raid.SCOURGE_OF_THE_PAST]: new Date("December 8, 2018 9:00:00 AM PST"),
    [Raid.CROWN_OF_SORROW]: new Date("June 5, 2019 4:00:00 PM PDT"),
    [Raid.GARDEN_OF_SALVATION]: new Date("October 6, 2019 10:00:00 AM PDT"),
    [Raid.DEEP_STONE_CRYPT]: new Date("November 22, 2020 10:00:00 AM PST"),
    [Raid.VAULT_OF_GLASS]: new Date("May 23, 2021 10:00:00 AM PDT"),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date("March 6, 2022 10:00:00 AM PST"),
    [Raid.KINGS_FALL]: new Date("August 27, 2022 10:00:00 AM PDT"),
    [Raid.ROOT_OF_NIGHTMARES]: new Date("March 11, 2023 9:00:00 AM PST")
}

export const Short: { [key in Raid]: string } = {
    [Raid.LEVIATHAN]: "Levi",
    [Raid.EATER_OF_WORLDS]: "EoW",
    [Raid.SPIRE_OF_STARS]: "Spire",
    [Raid.LAST_WISH]: "Wish",
    [Raid.SCOURGE_OF_THE_PAST]: "SotP",
    [Raid.CROWN_OF_SORROW]: "CoS",
    [Raid.GARDEN_OF_SALVATION]: "GoS",
    [Raid.DEEP_STONE_CRYPT]: "DSC",
    [Raid.VAULT_OF_GLASS]: "VoG",
    [Raid.VOW_OF_THE_DISCIPLE]: "Vow",
    [Raid.KINGS_FALL]: "KF",
    [Raid.ROOT_OF_NIGHTMARES]: "RoN",
    [Raid.NA]: "*"
}
