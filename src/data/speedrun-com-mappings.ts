import { type ListedRaid } from "../services/raidhub/types"
import { Raid } from "./raid"

export type RTABoardCategory =
    | "standard"
    | "any-percent"
    | "trio"
    | "prestige"
    | "trio-all-encounters"

export const destiny2GameId = "4d7y5zd7"

export const SpeedrunPlacementIcons = {
    base: "https://www.speedrun.com/static/theme/prdlmnwn/",
    variants: {
        [1]: "1st",
        [2]: "2nd",
        [3]: "3rd"
    }
}

export const SpeedrunVariables: Record<
    ListedRaid,
    {
        categoryId: string
        variable?: {
            variableId: string
            values: Partial<Record<RTABoardCategory, { id: string; displayName: string }>>
        }
    }
> = {
    [Raid.LEVIATHAN]: {
        categoryId: "jdzvzqvk",
        variable: {
            variableId: "68kmerkl",
            values: {
                standard: { id: "4qy4j26q", displayName: "Normal" },
                prestige: { id: "mln3zvoq", displayName: "Prestige" }
            }
        }
    },
    [Raid.EATER_OF_WORLDS]: {
        categoryId: "824r4ygd"
    },
    [Raid.SPIRE_OF_STARS]: {
        categoryId: "9d8g973k"
    },
    [Raid.LAST_WISH]: {
        categoryId: "02qlzqpk",
        variable: {
            variableId: "j84km3wn",
            values: {
                standard: { id: "8107wkol", displayName: "All Encounters" },
                trio: { id: "810292jq", displayName: "Trio All Encounters" },
                "any-percent": { id: "9qjdxk7q", displayName: "Any %" }
            }
        }
    },
    [Raid.SCOURGE_OF_THE_PAST]: {
        categoryId: "mkernrnd",
        variable: {
            variableId: "5ly7jpgl",
            values: {
                "any-percent": { id: "mln32enq", displayName: "Any %" },
                standard: { id: "4qy467dq", displayName: "No Major Glitches" }
            }
        }
    },
    [Raid.CROWN_OF_SORROW]: {
        categoryId: "9d8g973k"
    },
    [Raid.GARDEN_OF_SALVATION]: {
        categoryId: "7dgng872",
        variable: {
            variableId: "wl3d3gy8",
            values: {
                standard: { id: "4lxn3041", displayName: "Any %" },
                trio: { id: "814z3kvl", displayName: "Trio" }
            }
        }
    },
    [Raid.DEEP_STONE_CRYPT]: {
        categoryId: "zd3oymnd",
        variable: {
            variableId: "789dj59n",
            values: {
                standard: { id: "zqo4dmx1", displayName: "Any %" },
                trio: { id: "013g3wxl", displayName: "Trio" }
            }
        }
    },
    [Raid.VAULT_OF_GLASS]: {
        categoryId: "q25x58vk",
        variable: {
            variableId: "e8mqrmwn",
            values: {
                standard: { id: "jqzj7eml", displayName: "Any %" },
                trio: { id: "klrgw42q", displayName: "Trio" }
            }
        }
    },
    [Raid.VOW_OF_THE_DISCIPLE]: {
        categoryId: "7kj909n2",
        variable: {
            variableId: "gnx2yo48",
            values: {
                standard: { id: "q75vror1", displayName: "Any %" },
                trio: { id: "1gnw26ol", displayName: "Trio" }
            }
        }
    },
    [Raid.KINGS_FALL]: {
        categoryId: "9kvlp902",
        variable: {
            variableId: "9l75odz8",
            values: {
                standard: { id: "192joekq", displayName: "Any %" },
                trio: { id: "12v6yjkq", displayName: "Trio" }
            }
        }
    },
    [Raid.ROOT_OF_NIGHTMARES]: {
        categoryId: "9d88x6ld",
        variable: {
            variableId: "jlzxvz78",
            values: {
                standard: { id: "lx5v72r1", displayName: "Any %" },
                trio: { id: "14o50mjq", displayName: "Trio" }
            }
        }
    },

    [Raid.CROTAS_END]: {
        categoryId: "wdm1pm3d",
        variable: {
            variableId: "onv91378",
            values: {
                standard: { id: "1py4nxg1", displayName: "Any %" },
                trio: { id: "qke98znq", displayName: "Trio" }
            }
        }
    }
}
