import { RaidHashes } from "~/data/raid-hashes"
import {
    ListedRaid,
    ContestRaid,
    Difficulty,
    NoContestRaid,
    Raid,
    RaidDifficultyTuple,
    ReprisedContestRaidDifficulties,
    ValidRaidHash
} from "../../types/raids"
import { LocalStrings } from "../presentation/localized-strings"
import { Tag } from "../raidhub/tags"

export function isDayOne(raid: ListedRaid, ended: Date): boolean {
    if (DayOneEnd[raid] === undefined) {
        return false
    } else {
        return ended.getTime() < DayOneEnd[raid]!.getTime()
    }
}

export function isContest(raid: ListedRaid, started: Date): boolean {
    if (ContestEnd[raid as ContestRaid] === undefined) {
        return false
    } else {
        return started.getTime() < ContestEnd[raid as ContestRaid].getTime()
    }
}
export function isWeekOne(raid: ListedRaid, ended: Date): boolean {
    if (WeekOneEnd[raid as NoContestRaid] === undefined) {
        return false
    } else {
        return ended.getTime() < WeekOneEnd[raid as NoContestRaid].getTime()
    }
}

export function raidVersion(
    [raid, difficulty]: RaidDifficultyTuple,
    startDate: Date,
    endDate: Date,
    strings: LocalStrings,
    includeNormal: boolean = true
): string {
    if (
        ReprisedContestRaidDifficulties.includes(
            difficulty as (typeof ReprisedContestRaidDifficulties)[number]
        )
    ) {
        return strings.difficulty[difficulty]
    } else if (isDayOne(raid, endDate)) {
        return strings.tags[Tag.DAY_ONE]
    } else if (isContest(raid, startDate)) {
        return strings.difficulty[Difficulty.CONTEST]
    } else if (difficulty !== Difficulty.NORMAL) {
        return strings.difficulty[difficulty]
    } else if (includeNormal) {
        return strings.difficulty[Difficulty.NORMAL]
    } else {
        return ""
    }
}
export function raidTupleFromHash(hash: string): RaidDifficultyTuple {
    const tuple = HashDictionary[hash]
    if (tuple) {
        return tuple
    } else {
        throw new Error("Invalid raid hash " + hash)
    }
}

const HashDictionary = (() =>
    Object.fromEntries(
        Object.entries(
            RaidHashes as unknown as Record<Raid, Partial<Record<Difficulty, ValidRaidHash[]>>>
        )
            .map(([raid, difficultyDict]) =>
                Object.entries(difficultyDict).map(([difficulty, hashes]) =>
                    hashes.map(
                        hash =>
                            [
                                hash,
                                [parseInt(raid) as ListedRaid, parseInt(difficulty) as Difficulty]
                            ] as const
                    )
                )
            )
            .flat(2)
    ))()

export const AllValidHashes = Object.keys(HashDictionary) as ValidRaidHash[]

// CONSTANTS

export const ReleaseDate: Record<ListedRaid, Date> = {
    [Raid.LEVIATHAN]: new Date("September 13, 2017 10:00:00 AM PDT"),
    [Raid.EATER_OF_WORLDS]: new Date("December 8, 2017 10:00:00 AM PST"),
    [Raid.SPIRE_OF_STARS]: new Date("May 11, 2018 10:00:00 AM PDT"),
    [Raid.LAST_WISH]: new Date("September 14, 2018 10:00:00 AM PDT"),
    [Raid.SCOURGE_OF_THE_PAST]: new Date("December 7, 2018 9:00:00 AM PST"),
    [Raid.CROWN_OF_SORROW]: new Date("June 4, 2019 4:00:00 PM PDT"),
    [Raid.GARDEN_OF_SALVATION]: new Date("October 5, 2019 10:00:00 AM PDT"),
    [Raid.DEEP_STONE_CRYPT]: new Date("November 21, 2020 10:00:00 AM PST"),
    [Raid.VAULT_OF_GLASS]: new Date("May 22, 2021 10:00:00 AM PDT"),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date("March 5, 2022 10:00:00 AM PST"),
    [Raid.KINGS_FALL]: new Date("August 26, 2022 10:00:00 AM PDT"),
    [Raid.ROOT_OF_NIGHTMARES]: new Date("March 10, 2023 9:00:00 AM PST"),
    [Raid.CROTAS_END]: new Date("September 1, 2023 10:00:00 AM PDT")
}

const DayOneEnd: Record<ListedRaid, Date> = {
    [Raid.LEVIATHAN]: new Date("September 14, 2017 10:00:00 AM PDT"),
    [Raid.EATER_OF_WORLDS]: new Date("December 9, 2017 10:00:00 AM PST"),
    [Raid.SPIRE_OF_STARS]: new Date("May 12, 2018 10:00:00 AM PDT"),
    [Raid.LAST_WISH]: new Date("September 15, 2018 10:00:00 AM PDT"),
    [Raid.SCOURGE_OF_THE_PAST]: new Date("December 8, 2018 9:00:00 AM PST"),
    [Raid.CROWN_OF_SORROW]: new Date("June 5, 2019 4:00:00 PM PDT"),
    [Raid.GARDEN_OF_SALVATION]: new Date("October 6, 2019 10:00:00 AM PDT"),
    [Raid.DEEP_STONE_CRYPT]: new Date("November 22, 2020 10:00:00 AM PST"),
    [Raid.VAULT_OF_GLASS]: new Date("May 23, 2021 10:00:00 AM PDT"),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date("March 6, 2022 10:00:00 AM PST"),
    [Raid.KINGS_FALL]: new Date("August 27, 2022 10:00:00 AM PDT"),
    [Raid.ROOT_OF_NIGHTMARES]: new Date("March 11, 2023 9:00:00 AM PST"),
    [Raid.CROTAS_END]: new Date("September 2, 2023 10:00:00 AM PDT")
}

const ContestEnd: Record<ContestRaid, Date> = {
    [Raid.CROWN_OF_SORROW]: new Date("June 5, 2019 4:00:00 PM PDT"),
    [Raid.GARDEN_OF_SALVATION]: new Date("October 6, 2019 10:00:00 AM PDT"),
    [Raid.DEEP_STONE_CRYPT]: new Date("November 22, 2020 10:00:00 AM PST"),
    [Raid.VAULT_OF_GLASS]: new Date("May 23, 2021 10:00:00 AM PDT"),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date("March 7, 2022 10:00:00 AM PST"),
    [Raid.KINGS_FALL]: new Date("August 27, 2022 10:00:00 AM PDT"),
    [Raid.ROOT_OF_NIGHTMARES]: new Date("March 12, 2023 9:00:00 AM PST"),
    [Raid.CROTAS_END]: new Date("September 3, 2023 10:00:00 AM PDT")
}

const WeekOneEnd: Record<NoContestRaid, Date> = {
    [Raid.LEVIATHAN]: new Date("September 19, 2017 10:00:00 AM PDT"),
    [Raid.EATER_OF_WORLDS]: new Date("December 12th, 2017 10:00:00 AM PST"),
    [Raid.SPIRE_OF_STARS]: new Date("May 15, 2018 10:00:00 AM PDT"),
    [Raid.LAST_WISH]: new Date("September 18, 2018 10:00:00 AM PDT"),
    [Raid.SCOURGE_OF_THE_PAST]: new Date("December 11, 2018 9:00:00 AM PST")
}

export const BackdropOpacity: {
    [key in Raid]: number
} = {
    [Raid.LEVIATHAN]: 0.8,
    [Raid.EATER_OF_WORLDS]: 0.8,
    [Raid.SPIRE_OF_STARS]: 0.8,
    [Raid.LAST_WISH]: 0.9,
    [Raid.SCOURGE_OF_THE_PAST]: 0.8,
    [Raid.CROWN_OF_SORROW]: 0.8,
    [Raid.GARDEN_OF_SALVATION]: 0.8,
    [Raid.DEEP_STONE_CRYPT]: 0.9,
    [Raid.VAULT_OF_GLASS]: 0.9,
    [Raid.VOW_OF_THE_DISCIPLE]: 0.9,
    [Raid.KINGS_FALL]: 0.8,
    [Raid.ROOT_OF_NIGHTMARES]: 0.9,
    [Raid.CROTAS_END]: 0.9,
    [Raid.NA]: 0
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
    [Raid.CROTAS_END]: "CE",
    [Raid.NA]: "*"
}

export const UrlPathsToRaid = {
    leviathan: Raid.LEVIATHAN,
    eaterofworlds: Raid.EATER_OF_WORLDS,
    spireofstars: Raid.SPIRE_OF_STARS,
    lastwish: Raid.LAST_WISH,
    scourgeofthepast: Raid.SCOURGE_OF_THE_PAST,
    crownofsorrow: Raid.CROWN_OF_SORROW,
    gardenofsalvation: Raid.GARDEN_OF_SALVATION,
    deepstonecrypt: Raid.DEEP_STONE_CRYPT,
    vaultofglass: Raid.VAULT_OF_GLASS,
    vowofthedisciple: Raid.VOW_OF_THE_DISCIPLE,
    kingsfall: Raid.KINGS_FALL,
    rootofnightmares: Raid.ROOT_OF_NIGHTMARES,
    crotasend: Raid.CROTAS_END
} satisfies Record<string, ListedRaid>

export const RaidToUrlPaths = {
    [Raid.LEVIATHAN]: "leviathan",
    [Raid.EATER_OF_WORLDS]: "eaterofworlds",
    [Raid.SPIRE_OF_STARS]: "spireofstars",
    [Raid.LAST_WISH]: "lastwish",
    [Raid.SCOURGE_OF_THE_PAST]: "scourgeofthepast",
    [Raid.CROWN_OF_SORROW]: "crownofsorrow",
    [Raid.GARDEN_OF_SALVATION]: "gardenofsalvation",
    [Raid.DEEP_STONE_CRYPT]: "deepstonecrypt",
    [Raid.VAULT_OF_GLASS]: "vaultofglass",
    [Raid.VOW_OF_THE_DISCIPLE]: "vowofthedisciple",
    [Raid.KINGS_FALL]: "kingsfall",
    [Raid.ROOT_OF_NIGHTMARES]: "rootofnightmares",
    [Raid.CROTAS_END]: "crotasend"
} satisfies Record<ListedRaid, keyof typeof UrlPathsToRaid>

// todo with our own api, we can change these
export const DifficultyToUrlPaths = {
    [Difficulty.NORMAL]: "normal" as const,
    [Difficulty.PRESTIGE]: "prestige" as const,
    [Difficulty.MASTER]: "master" as const,
    [Difficulty.CHALLENGE_VOG]: "temposedge" as const,
    [Difficulty.CHALLENGE_KF]: "regicide" as const,
    [Difficulty.CHALLENGE_CROTA]: "superiorswordplay" as const
} satisfies Partial<Record<Difficulty, keyof typeof UrlPathsToDifficulty>>

export const UrlPathsToDifficulty = {
    normal: Difficulty.NORMAL,
    prestige: Difficulty.PRESTIGE,
    master: Difficulty.MASTER,
    temposedge: Difficulty.CHALLENGE_VOG,
    regicide: Difficulty.CHALLENGE_KF,
    superiorswordplay: Difficulty.CHALLENGE_CROTA
} satisfies Record<string, Difficulty>
