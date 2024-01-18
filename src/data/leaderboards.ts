import { ListedRaid, Raid } from "~/types/raids"

export type Board = "normal" | "prestige" | "pc" | "challenge" | "master"
export const LeaderboardsForRaid = {
    [Raid.LEVIATHAN]: {
        normal: "leviathan_normal",
        prestige: "leviathan_prestige",
        pc: "levi_pc"
    },
    [Raid.EATER_OF_WORLDS]: {
        normal: "eaterofworlds_normal",
        prestige: "eaterofworlds_prestige"
    },
    [Raid.SPIRE_OF_STARS]: {
        normal: "spireofstars_normal",
        prestige: "spireofstars_prestige"
    },
    [Raid.LAST_WISH]: {
        normal: "lastwish_normal"
    },
    [Raid.SCOURGE_OF_THE_PAST]: {
        normal: "scourgeofthepast_normal"
    },
    [Raid.CROWN_OF_SORROW]: {
        normal: "crownofsorrow_normal"
    },
    [Raid.GARDEN_OF_SALVATION]: {
        normal: "gardenofsalvation_normal"
    },
    [Raid.DEEP_STONE_CRYPT]: {
        normal: "deepstonecrypt_normal"
    },
    [Raid.VAULT_OF_GLASS]: {
        normal: "vaultofglass_normal",
        challenge: "vaultofglass_challenge",
        master: "vaultofglass_master"
    },
    [Raid.VOW_OF_THE_DISCIPLE]: {
        normal: "vowofthedisciple_normal",
        master: "vowofthedisciple_master"
    },
    [Raid.KINGS_FALL]: {
        normal: "kingsfall_normal",
        challenge: "kingsfall_challenge",
        master: "kingsfall_master"
    },
    [Raid.ROOT_OF_NIGHTMARES]: {
        normal: "rootofnightmares_normal",
        master: "rootofnightmares_master"
    },
    [Raid.CROTAS_END]: {
        normal: "crotasend_normal",
        challenge: "crotasend_challenge",
        master: "crotasend_master"
    }
} as const satisfies Record<ListedRaid, Partial<Record<Board, string>>>
