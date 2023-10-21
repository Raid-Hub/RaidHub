import { MasterRaid, PrestigeRaid, Raid } from "~/types/raids"

export const MasterReleases: Record<MasterRaid, Date> = {
    [Raid.VAULT_OF_GLASS]: new Date("July 6, 2021 1:00:00 PM EDT"),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date("April 19, 2022 1:00:00 PM EDT"),
    [Raid.KINGS_FALL]: new Date("September 20, 2022 1:00:00 PM EDT"),
    [Raid.ROOT_OF_NIGHTMARES]: new Date("March 28, 2023 1:00:00 PM EDT"),
    [Raid.CROTAS_END]: new Date("September 21, 2023 1:00:00 PM EDT")
}

export const PrestigeReleases: Record<PrestigeRaid, Date> = {
    [Raid.LEVIATHAN]: new Date("October 18, 2017 1:00:00 PM EDT"),
    [Raid.EATER_OF_WORLDS]: new Date("July 17, 2018 1:00:00 PM EDT"),
    [Raid.SPIRE_OF_STARS]: new Date("July 18, 2018 1:00:00 PM EDT")
}

export const PCLeviathanRelease = new Date("November 1, 2017 1:00:00 PM EDT")
