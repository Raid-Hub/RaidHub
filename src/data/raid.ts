import { assert, Equals } from "tsafe"
import { components } from "~/types/raidhub-openapi"

export const Raid = {
    LEVIATHAN: 1,
    EATER_OF_WORLDS: 2,
    SPIRE_OF_STARS: 3,
    LAST_WISH: 4,
    SCOURGE_OF_THE_PAST: 5,
    CROWN_OF_SORROW: 6,
    GARDEN_OF_SALVATION: 7,
    DEEP_STONE_CRYPT: 8,
    VAULT_OF_GLASS: 9,
    VOW_OF_THE_DISCIPLE: 10,
    KINGS_FALL: 11,
    ROOT_OF_NIGHTMARES: 12,
    CROTAS_END: 13
} satisfies Record<string, components["schemas"]["RaidEnum"]>

export const Difficulty = {
    NORMAL: 1,
    GUIDEDGAMES: 2,
    PRESTIGE: 3,
    MASTER: 4,
    CHALLENGE_VOG: 64,
    CHALLENGE_KF: 65,
    CHALLENGE_CROTA: 66
} satisfies Record<string, components["schemas"]["RaidVersionEnum"]>

assert<Equals<(typeof Raid)[keyof typeof Raid], components["schemas"]["RaidEnum"]>>(true)
assert<
    Equals<(typeof Difficulty)[keyof typeof Difficulty], components["schemas"]["RaidVersionEnum"]>
>(true)
