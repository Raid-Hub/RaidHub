import { Tag } from "~/util/tags"

export const TagStrings: { [key in Tag]: string } = {
    [Tag.CHECKPOINT]: "Checkpoint",
    [Tag.SOLO]: "Solo",
    [Tag.DUO]: "Duo",
    [Tag.TRIO]: "Trio",
    [Tag.DAY_ONE]: "Day One",
    [Tag.CONTEST]: "Contest",
    [Tag.WEEK_ONE]: "Week One",
    [Tag.MASTER]: "Master",
    [Tag.PRESTIGE]: "Prestige",
    [Tag.FLAWLESS]: "Flawless",
    [Tag.CHALLENGE_VOG]: "Tempo's Edge",
    [Tag.CHALLENGE_KF]: "Regicide",
    [Tag.CHALLENGE_CROTA]: "Superior Swordplay",
    [Tag.ABILITIES_ONLY]: "Abilities Only",
    [Tag.FRESH]: "Full",
    [Tag.GUIDEDGAMES]: "Guided Games"
}
