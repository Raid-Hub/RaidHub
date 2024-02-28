import { type ListedRaid } from "../types/raidhub-api"
import { Raid } from "./raid"

export type RTABoardCategory =
    | "all"
    | "standard"
    | "any-percent"
    | "trio"
    | "prestige"
    | "no-major-glitches"
    | "trio-all-encounters"

export const destiny2GameId = "4d7y5zd7"

export const SpeedrunBoardId: Record<ListedRaid, string | null> = {
    [Raid.LEVIATHAN]: "jdzvzqvk",
    [Raid.EATER_OF_WORLDS]: "824r4ygd",
    [Raid.SPIRE_OF_STARS]: "9d8g973k",
    [Raid.LAST_WISH]: "02qlzqpk",
    [Raid.SCOURGE_OF_THE_PAST]: "mkernrnd",
    [Raid.CROWN_OF_SORROW]: "8241elw2",
    [Raid.GARDEN_OF_SALVATION]: "7dgng872",
    [Raid.DEEP_STONE_CRYPT]: "zd3oymnd",
    [Raid.VAULT_OF_GLASS]: "q25x58vk",
    [Raid.VOW_OF_THE_DISCIPLE]: "7kj909n2",
    [Raid.KINGS_FALL]: "9kvlp902",
    [Raid.ROOT_OF_NIGHTMARES]: "9d88x6ld",
    [Raid.CROTAS_END]: "wdm1pm3d"
}

export const SpeedrunVariables: Record<
    ListedRaid,
    {
        variable: string
        values: Partial<
            Record<Exclude<RTABoardCategory, "all">, { id: string; displayName: string }>
        >
    } | null
> = {
    [Raid.LEVIATHAN]: {
        variable: "68kmerkl",
        values: {
            standard: { id: "4qy4j26q", displayName: "Normal" },
            prestige: { id: "mln3zvoq", displayName: "Prestige" }
        }
    },
    [Raid.EATER_OF_WORLDS]: null,
    [Raid.SPIRE_OF_STARS]: null,
    [Raid.SCOURGE_OF_THE_PAST]: {
        variable: "5ly7jpgl",
        values: {
            "any-percent": { id: "mln32enq", displayName: "Any %" },
            "no-major-glitches": { id: "4qy467dq", displayName: "No Major Glitches" }
        }
    },
    [Raid.CROWN_OF_SORROW]: null,
    [Raid.LAST_WISH]: {
        variable: "j84km3wn",
        values: {
            standard: { id: "8107wkol", displayName: "All Encounters" },
            trio: { id: "810292jq", displayName: "Trio All Encounters" },
            "any-percent": { id: "9qjdxk7q", displayName: "Any %" }
        }
    },
    [Raid.GARDEN_OF_SALVATION]: {
        variable: "wl3d3gy8",
        values: {
            standard: { id: "4lxn3041", displayName: "Any %" },
            trio: { id: "814z3kvl", displayName: "Trio" }
        }
    },
    [Raid.DEEP_STONE_CRYPT]: {
        variable: "789dj59n",
        values: {
            standard: { id: "zqo4dmx1", displayName: "Any %" },
            trio: { id: "013g3wxl", displayName: "Trio" }
        }
    },
    [Raid.VAULT_OF_GLASS]: {
        variable: "e8mqrmwn",
        values: {
            standard: { id: "jqzj7eml", displayName: "Any %" },
            trio: { id: "klrgw42q", displayName: "Trio" }
        }
    },
    [Raid.VOW_OF_THE_DISCIPLE]: {
        variable: "gnx2yo48",
        values: {
            standard: { id: "q75vror1", displayName: "Any %" },
            trio: { id: "1gnw26ol", displayName: "Trio" }
        }
    },
    [Raid.KINGS_FALL]: {
        variable: "9l75odz8",
        values: {
            standard: { id: "192joekq", displayName: "Any %" },
            trio: { id: "12v6yjkq", displayName: "Any %" }
        }
    },
    [Raid.ROOT_OF_NIGHTMARES]: {
        variable: "jlzxvz78",
        values: {
            standard: { id: "lx5v72r1", displayName: "Any %" },
            trio: { id: "14o50mjq", displayName: "Trio" }
        }
    },

    [Raid.CROTAS_END]: {
        variable: "onv91378",
        values: {
            standard: { id: "1py4nxg1", displayName: "Any %" },
            trio: { id: "qke98znq", displayName: "Trio" }
        }
    }
}
