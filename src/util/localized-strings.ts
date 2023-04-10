import { Raid } from "./raid"
import { Tag } from "./tags"
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
    abilityKills: string
    timeSpent: string
    tags: { [key in Tag]: string }
    loadMore: string
}

export const LocalizedStrings: { [key in SupportedLanguage]: LocalStrings } = {
    [SupportedLanguage.ENGLISH]: {
        checkPointDisclaimer: "Note: this report may or may not be a checkpoint due to API issues from Season of the Hunt through Season of the Risen",
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
            [Raid.NA]: "Non-Raid",
        },
        loading: "Loading...",
        none: "None",
        mvp: "MVP",
        totalKills: "Total Kills",
        deaths: "Deaths",
        totalDeaths: "Total Deaths",
        abilityKillsPercentage: "Ability Kills %",
        totalCharactersUsed: "Total Characters Used",
        mostUsedWeapon: "Most Used Weapon",
        kills: "Kills",
        assists: "Assists",
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
        },
        loadMore: "Load more"
    }
}

export function isSupported(language: string) {
    return language in LocalizedStrings
}