import { Raid } from "./raid"

export enum SupportedLanguage {
    ENGLISH = "en-US"
}
interface LocalStrings {
    checkPointDisclaimer: string,
    incompleteRaid: string,
    raidNames: {[key in Raid]: string},
    loading: string
}

export const LocalizedStrings: { [key in SupportedLanguage]: LocalStrings } = {
    [SupportedLanguage.ENGLISH]: {
        checkPointDisclaimer: "Note: this report may or may not be a checkpoint due to API issues from Season of the Hunt through Season of the Risen",
        incompleteRaid: "Incomplete",
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
        loading: "Loading..."
    }
}

export function isSupported(language: string) {
    return language in LocalizedStrings
}