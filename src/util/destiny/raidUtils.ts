import { RaidHashes } from "~/data/raid-hashes"
import {
    ListedRaid,
    Difficulty,
    Raid,
    RaidDifficultyTuple,
    ReprisedContestRaidDifficulties,
    ValidRaidHash
} from "../../types/raids"
import { LocalStrings } from "../presentation/localized-strings"
import { Tag } from "../raidhub/tags"
import Activity from "~/models/profile/data/Activity"

export function raidVersion(
    activity: Activity,
    strings: LocalStrings,
    includeNormal: boolean = true
): string {
    if (
        ReprisedContestRaidDifficulties.includes(
            activity.difficulty as (typeof ReprisedContestRaidDifficulties)[number]
        )
    ) {
        return strings.difficulty[activity.difficulty]
    } else if (activity.dayOne) {
        return strings.tags[Tag.DAY_ONE]
    } else if (activity.contest) {
        return strings.difficulty[Difficulty.CONTEST]
    } else if (activity.difficulty !== Difficulty.NORMAL) {
        return strings.difficulty[activity.difficulty]
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
