import { ListedRaid, Raid } from "../types/raids"
import { LocalStrings } from "../util/presentation/localized-strings"

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
    [Raid.CROTAS_END]: null
}

export const SpeedrunVariables = {
    [Raid.LEVIATHAN]: {
        variable: "68kmerkl",
        values: {
            normal: { id: "4qy4j26q", name: "normal" },
            prestige: { id: "mln3zvoq", name: "prestige" }
        }
    },
    [Raid.EATER_OF_WORLDS]: null,
    [Raid.SPIRE_OF_STARS]: null,
    [Raid.SCOURGE_OF_THE_PAST]: {
        variable: "5ly7jpgl",
        values: {
            "any%": { id: "mln32enq", name: "anyPercent" },
            "no-major-glitches": { id: "4qy467dq", name: "noMajorGlitches" }
        }
    },
    [Raid.CROWN_OF_SORROW]: null,
    [Raid.LAST_WISH]: {
        variable: "j84km3wn",
        values: {
            "all-encounters": { id: "8107wkol", name: "allEncounters" },
            trio: { id: "810292jq", name: "trioAllEncounters" },
            "any%": { id: "9qjdxk7q", name: "anyPercent" }
        }
    },
    [Raid.GARDEN_OF_SALVATION]: {
        variable: "wl3d3gy8",
        values: {
            "any%": { id: "4lxn3041", name: "anyPercent" },
            trio: { id: "814z3kvl", name: "trio" }
        }
    },
    [Raid.DEEP_STONE_CRYPT]: {
        variable: "789dj59n",
        values: {
            "any%": { id: "zqo4dmx1", name: "anyPercent" },
            trio: { id: "013g3wxl", name: "trio" }
        }
    },
    [Raid.VAULT_OF_GLASS]: {
        variable: "e8mqrmwn",
        values: {
            "any%": { id: "jqzj7eml", name: "anyPercent" },
            trio: { id: "klrgw42q", name: "trio" }
        }
    },
    [Raid.VOW_OF_THE_DISCIPLE]: {
        variable: "gnx2yo48",
        values: {
            "any%": { id: "q75vror1", name: "anyPercent" },
            trio: { id: "1gnw26ol", name: "trio" }
        }
    },
    [Raid.KINGS_FALL]: {
        variable: "9l75odz8",
        values: {
            "any%": { id: "192joekq", name: "anyPercent" },
            trio: { id: "12v6yjkq", name: "trio" }
        }
    },
    [Raid.ROOT_OF_NIGHTMARES]: {
        variable: "jlzxvz78",
        values: {
            "any%": { id: "lx5v72r1", name: "anyPercent" },
            trio: { id: "14o50mjq", name: "trio" }
        }
    },

    [Raid.CROTAS_END]: null
} as const satisfies Record<
    ListedRaid,
    {
        variable: string
        values: Record<string, SpeedData>
    } | null
>

export type SpeedData = { id: string; name: keyof LocalStrings["leaderboards"] }
