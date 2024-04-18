import { type Equals } from "tsafe"
import type { components } from "~/services/raidhub/openapi"

export const Raid = Object.freeze({
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
}) satisfies Record<string, components["schemas"]["RaidEnum"]>

export const Difficulty = Object.freeze({
    NORMAL: 1,
    GUIDEDGAMES: 2,
    PRESTIGE: 3,
    MASTER: 4,
    CHALLENGE_VOG: 64,
    CHALLENGE_KF: 65,
    CHALLENGE_CROTA: 66,
    ATRAKS_SOVREIGN: 128,
    ORXY_EXHALTED: 129,
    RHULK_INDOMITABLE: 130,
    NEZAREC_SUBLIME: 131
}) satisfies Record<string, components["schemas"]["ActivityVersionEnum"]>

// These checks are here to make sure that the types of the enums are correct.
// We should use the manifest enums instead of hardcoding the values as much as possible,
// There are some places where it makes sense to use front end enums, but we should try to avoid it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const a: Equals<(typeof Raid)[keyof typeof Raid], components["schemas"]["RaidEnum"]> = true
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const b: Equals<
    (typeof Difficulty)[keyof typeof Difficulty],
    components["schemas"]["ActivityVersionEnum"]
> = true
