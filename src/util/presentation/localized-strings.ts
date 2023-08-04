import { Tag } from "../raidhub/tags"
import { Difficulty, Raid } from "../../types/raids"
import { RankingBannerType } from "../../types/profile"
import { FilterListName, FilterOption } from "../profile/activityFilters"

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
    toggle: {
        charts: string
        tiles: string
    }
    viewProfile: string
    inGame: string
    elapsedTime: string
    fireteam: string
    manageAccount: string
    logIn: string
    logOut: string
    logInWith: string
    activityFilters: { [key in FilterOption]: string }
    activeFilters: string
    filterNames: { [key in FilterListName]: string }
    clickToView: string
    loginToAccess: string
    back: string
    next: string
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
            [Raid.CROTAS_END]: "Crota's End",
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
            [Tag.WEEK_ONE]: "Week One",
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
            [Raid.CROTAS_END]: "Crota",
            [Raid.NA]: ""
        },
        toggle: {
            charts: "Charts",
            tiles: "Tiles"
        },
        viewProfile: "View Profile",
        inGame: "In Game",
        elapsedTime: "Elapsed time",
        fireteam: "Fireteam",
        manageAccount: "Manage Account",
        logIn: "Log In",
        logOut: "Log Out",
        logInWith: "Log In with",
        activityFilters: {
            [FilterOption.SUCCESS]: "Success",
            [FilterOption.FLAWLESS]: "Flawless",
            [FilterOption.TRIO]: "Trio",
            [FilterOption.DUO]: "Duo",
            [FilterOption.SOLO]: "Solo",
            [FilterOption.DIFFICULTY]: "Difficulty",
            [FilterOption.MIN_MINS_PLAYED]: "Min minutes played"
        },
        activeFilters: "Active Filters",
        filterNames: {
            [FilterListName.Success]: "Complete",
            [FilterListName.Incomplete]: "Incomplete",
            [FilterListName.Flawless]: "Flawless",
            [FilterListName.AnyLowman]: "Lowman",
            [FilterListName.Solo]: "Solo",
            [FilterListName.Duo]: "Duo",
            [FilterListName.Trio]: "Trio",
            [FilterListName.MinMinutes]: "Minimum Minutes Played",
            [FilterListName.Master]: "Master",
            [FilterListName.Prestige]: "Prestige",
            [FilterListName.Or]: "Or Group",
            [FilterListName.And]: "And Group",
            [FilterListName.Not]: "Not Element"
        },
        clickToView: "Click to View",
        loginToAccess: "If this profile belongs to you, please Login to Access",
        back: "back",
        next: "next"
    }
}
