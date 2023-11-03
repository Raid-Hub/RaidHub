import { ListedRaid, Raid } from "~/types/raids"

export type Board = "normal" | "prestige" | "pc" | "challenge" | "master"
export const LeaderboardsForRaid = {
    [Raid.LEVIATHAN]: {
        normal: "wf_levi",
        prestige: "levi_prestige",
        pc: "levi_pc"
    },
    [Raid.EATER_OF_WORLDS]: {
        normal: "wf_eow",
        prestige: "levi_prestige"
    },
    [Raid.SPIRE_OF_STARS]: {
        normal: "wf_spire",
        prestige: "spire_prestige"
    },
    [Raid.LAST_WISH]: {
        normal: "wf_wish"
    },
    [Raid.SCOURGE_OF_THE_PAST]: {
        normal: "wf_sotp"
    },
    [Raid.CROWN_OF_SORROW]: {
        normal: "wf_cos"
    },
    [Raid.GARDEN_OF_SALVATION]: {
        normal: "wf_gos"
    },
    [Raid.DEEP_STONE_CRYPT]: {
        normal: "wf_dsc"
    },
    [Raid.VAULT_OF_GLASS]: {
        normal: "vog_normal",
        challenge: "wf_vog",
        master: "vog_master"
    },
    [Raid.VOW_OF_THE_DISCIPLE]: {
        normal: "wf_vow",
        master: "vow_master"
    },
    [Raid.KINGS_FALL]: {
        normal: "kf_normal",
        challenge: "wf_kf",
        master: "kf_master"
    },
    [Raid.ROOT_OF_NIGHTMARES]: {
        normal: "wf_ron",
        master: "ron_master"
    },
    [Raid.CROTAS_END]: {
        normal: "crota_normal",
        challenge: "wf_crota",
        master: "crota_master"
    }
} as const satisfies Record<ListedRaid, Partial<Record<Board, string>>>
