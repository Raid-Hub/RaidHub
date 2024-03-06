import { Difficulty } from "~/data/raid"

export enum Tag {
    CHECKPOINT = "Checkpoint",
    SOLO = "Solo",
    DUO = "Duo",
    TRIO = "Trio",
    DAY_ONE = "Day One",
    CONTEST = "Contest",
    WEEK_ONE = "Week One",
    MASTER = "Master",
    PRESTIGE = "Prestige",
    FLAWLESS = "Flawless",
    CHALLENGE_VOG = "Tempo's Edge",
    CHALLENGE_KF = "Regicide",
    CHALLENGE_CROTA = "Superior Swordplay",
    ABILITIES_ONLY = "Abilities Only",
    FRESH = "Full",
    GUIDEDGAMES = "Guided Games"
}

export const TagForLowMan = {
    1: Tag.SOLO,
    2: Tag.DUO,
    3: Tag.TRIO
}

export const TagForReprisedContest = {
    [Difficulty.CHALLENGE_VOG]: Tag.CHALLENGE_VOG,
    [Difficulty.CHALLENGE_KF]: Tag.CHALLENGE_KF,
    [Difficulty.CHALLENGE_CROTA]: Tag.CHALLENGE_CROTA
}
