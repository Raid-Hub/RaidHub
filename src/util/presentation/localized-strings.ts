import { Tag } from "../raidhub/tags"
import { Difficulty, Raid } from "../destiny/raid"
import { RankingBannerType } from "../../components/profile/Banners"
export enum SupportedLanguage {
    ENGLISH = "en"
}

export interface LocalStrings {
    checkPointDisclaimer: string
    incompleteRaid: string
    success: string
    raidNames: { [key in Raid]: string }
    loading: string
    none: string
    mvp: string
    totalKills: string
    deaths: string
    totalDeaths: string
    abilityKillsPercentage: string
    totalCharactersUsed: string
    mostUsedWeapon: string
    kills: string
    assists: string
    totalAssists: string
    abilityKills: string
    timeSpent: string
    tags: { [key in Tag]: string }
    loadMore: string
    difficulty: { [key in Difficulty]: string }
    dayOne: string
    contest: string
    killsPerMinute: string
    worldsFirstLeaderboards: string
    speedrunLeaderboards: string
    clearsLeaderboards: string
    comingSoon: string
    bannerTitles: { [key in RankingBannerType]: string }
    totalClears: string
    fastestClear: string
    averageClear: string
    sherpas: string
    na: string
    checkpoints: { [key in Raid]: string }
}

export const LocalizedStrings: { [key in SupportedLanguage]: LocalStrings } = {
    [SupportedLanguage.ENGLISH]: {
        checkPointDisclaimer:
            "Note: this report may or may not be a checkpoint due to API issues from Season of the Hunt through Season of the Risen",
        incompleteRaid: "Incomplete",
        success: "Success",
        raidNames: {
            [Raid.LEVIATHAN]: "Leviathan",
            [Raid.EATER_OF_WORLDS]: "Eater of Worlds",
            [Raid.SPIRE_OF_STARS]: "Spire of Stars",
            [Raid.LAST_WISH]: "Last Wish",
            [Raid.SCOURGE_OF_THE_PAST]: "Scourge of the Past",
            [Raid.CROWN_OF_SORROW]: "Crown of Sorrow",
            [Raid.GARDEN_OF_SALVATION]: "Garden of Salvation",
            [Raid.DEEP_STONE_CRYPT]: "Deep Stone Crypt",
            [Raid.VAULT_OF_GLASS]: "Vault of Glass",
            [Raid.VOW_OF_THE_DISCIPLE]: "Vow of the Disciple",
            [Raid.KINGS_FALL]: "King's Fall",
            [Raid.ROOT_OF_NIGHTMARES]: "Root of Nightmares",
            [Raid.NA]: "Non-Raid"
        },
        loading: "Loading...",
        none: "None",
        mvp: "MVP",
        totalKills: "Kills",
        deaths: "Deaths",
        totalDeaths: "Deaths",
        abilityKillsPercentage: "Ability Kills",
        totalCharactersUsed: "Characters",
        mostUsedWeapon: "Most Used Weapon",
        kills: "Kills",
        assists: "Assists",
        totalAssists: "Assists",
        abilityKills: "Ability Kills",
        timeSpent: "Time Spent",
        tags: {
            [Tag.CHECKPOINT]: "Checkpoint",
            [Tag.DAY_ONE]: "Day One",
            [Tag.CONTEST]: "Contest",
            [Tag.MASTER]: "Master",
            [Tag.PRESTIGE]: "Prestige",
            [Tag.SOLO]: "Solo",
            [Tag.DUO]: "Duo",
            [Tag.TRIO]: "Trio",
            [Tag.FLAWLESS]: "Flawless",
            [Tag.CHALLENGE_VOG]: "Tempo's Edge",
            [Tag.CHALLENGE_KF]: "Regicide",
            [Tag.ABILITIES_ONLY]: "Abilities Only",
            [Tag.FRESH]: "Full"
        },
        loadMore: "Load more",
        difficulty: {
            [Difficulty.NORMAL]: "Normal",
            [Difficulty.PRESTIGE]: "Prestige",
            [Difficulty.MASTER]: "Master",
            [Difficulty.CONTEST]: "Contest",
            [Difficulty.CHALLENGEVOG]: "Tempo's Edge",
            [Difficulty.CHALLENGEKF]: "Regicide"
        },
        dayOne: "Day One",
        contest: "Contest",
        killsPerMinute: "Kills / Minute",
        worldsFirstLeaderboards: "World's First Leaderboards",
        speedrunLeaderboards: "Speedrun Leaderboards",
        clearsLeaderboards: "Clears Leaderboards",
        comingSoon: "Coming soon...",
        bannerTitles: {
            [RankingBannerType.FullClears]: "Full Clears Rank",
            [RankingBannerType.Speed]: "Speed Rank"
        },
        totalClears: "Total Clears",
        fastestClear: "Fastest Clear",
        averageClear: "Average Clear",
        sherpas: "Sherpas",
        na: "N/A",
        checkpoints: {
            [Raid.LEVIATHAN]: "Calus",
            [Raid.EATER_OF_WORLDS]: "Argos",
            [Raid.SPIRE_OF_STARS]: "Val Ca'uor",
            [Raid.LAST_WISH]: "Queenswalk",
            [Raid.SCOURGE_OF_THE_PAST]: "Insurrection Prime",
            [Raid.CROWN_OF_SORROW]: "Gahlran",
            [Raid.GARDEN_OF_SALVATION]: "Sanctified Mind",
            [Raid.DEEP_STONE_CRYPT]: "Taniks",
            [Raid.VAULT_OF_GLASS]: "Atheon",
            [Raid.VOW_OF_THE_DISCIPLE]: "Rhulk",
            [Raid.KINGS_FALL]: "Oryx",
            [Raid.ROOT_OF_NIGHTMARES]: "Nezarec",
            [Raid.NA]: ""
        }
    }
}

export function isSupported(language: string) {
    return language in LocalizedStrings
}
