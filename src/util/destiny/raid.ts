import {
    AllRaidsUnion,
    ContestRaid,
    Difficulty,
    NoContestRaid,
    Raid,
    RaidDifficultyTuple,
    RaidHashes,
    ReprisedContestRaidDifficulties,
    ValidRaidHash
} from "../../types/raids"
import { LocalStrings } from "../presentation/localized-strings"
import { Tag } from "../raidhub/tags"

export function isDayOne(raid: Raid, ended: Date): boolean {
    if (DayOneEnd[raid as AllRaidsUnion] === undefined) {
        return false
    } else {
        return ended.getTime() < DayOneEnd[raid as AllRaidsUnion]!.getTime()
    }
}

export function isContest(raid: Raid, started: Date): boolean {
    if (ContestEnd[raid as ContestRaid] === undefined) {
        return false
    } else {
        return started.getTime() < ContestEnd[raid as ContestRaid].getTime()
    }
}
export function isWeekOne(raid: Raid, ended: Date): boolean {
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
    strings: LocalStrings
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
    } else {
        return strings.difficulty[difficulty]
    }
}
export function raidTupleFromHash(hash: string): RaidDifficultyTuple {
    return HashDictionary[hash] ?? [Raid.NA, Difficulty.NORMAL]
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
                                [parseInt(raid) as Raid, parseInt(difficulty) as Difficulty]
                            ] as const
                    )
                )
            )
            .flat(2)
    ))()

export const AllValidHashes = Object.keys(HashDictionary) as ValidRaidHash[]

// CONSTANTS
const DayOneEnd: Record<AllRaidsUnion, Date> = {
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

const ContestEnd: Record<ContestRaid, Date> = {
    [Raid.CROWN_OF_SORROW]: new Date("June 5, 2019 4:00:00 PM PDT"),
    [Raid.GARDEN_OF_SALVATION]: new Date("October 6, 2019 10:00:00 AM PDT"),
    [Raid.DEEP_STONE_CRYPT]: new Date("November 22, 2020 10:00:00 AM PST"),
    [Raid.VAULT_OF_GLASS]: new Date("May 23, 2021 10:00:00 AM PDT"),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date("March 7, 2022 10:00:00 AM PST"),
    [Raid.KINGS_FALL]: new Date("August 27, 2022 10:00:00 AM PDT"),
    [Raid.ROOT_OF_NIGHTMARES]: new Date("March 12, 2023 9:00:00 AM PST")
}

const WeekOneEnd: Record<NoContestRaid, Date> = {
    [Raid.LEVIATHAN]: new Date("September 19, 2017 10:00:00 AM PDT"),
    [Raid.EATER_OF_WORLDS]: new Date("December 12th, 2017 10:00:00 AM PST"),
    [Raid.SPIRE_OF_STARS]: new Date("May 15, 2018 10:00:00 AM PDT"),
    [Raid.LAST_WISH]: new Date("September 18, 2018 10:00:00 AM PDT"),
    [Raid.SCOURGE_OF_THE_PAST]: new Date("December 11, 2018 9:00:00 AM PST")
}
