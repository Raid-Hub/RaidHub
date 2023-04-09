import { RaidInfo } from "../models/pgcr/raid"
import { HTMLAttributes } from 'react';

export enum Raid {
    LEVIATHAN,
    EATER_OF_WORLDS,
    SPIRE_OF_STARS,
    LAST_WISH,
    SCOURGE_OF_THE_PAST,
    CROWN_OF_SORROW,
    GARDEN_OF_SALVATION,
    DEEP_STONE_CRYPT,
    VAULT_OF_GLASS,
    VOW_OF_THE_DISCIPLE,
    KINGS_FALL,
    ROOT_OF_NIGHTMARES,
    NA
}

export const AllRaids: Raid[] = [
    Raid.ROOT_OF_NIGHTMARES,
    Raid.KINGS_FALL,
    Raid.VOW_OF_THE_DISCIPLE,
    Raid.VAULT_OF_GLASS,
    Raid.DEEP_STONE_CRYPT,
    Raid.GARDEN_OF_SALVATION,
    Raid.LAST_WISH,
    Raid.CROWN_OF_SORROW,
    Raid.SCOURGE_OF_THE_PAST,
    Raid.SPIRE_OF_STARS,
    Raid.EATER_OF_WORLDS,
    Raid.LEVIATHAN,
]

export enum RaidDifficulty {
    NORMAL,
    PRESTIGE,
    CONTEST,
    MASTER,
    CHALLENGEVOG,
    CHALLENGEKF,
}

export const ContestRaidDifficulties = [RaidDifficulty.CHALLENGEVOG, RaidDifficulty.CHALLENGEKF]

export function raidDetailsFromHash(hash: string): RaidInfo {
    switch (hash) {
        case "89727599": case "287649202": case "1699948563": case "1875726950":
        case "2693136600": case "2693136601": case "2693136602": case "2693136603":
        case "2693136604": case "2693136605": case "3916343513": case "4039317196":
            return new RaidInfo(Raid.LEVIATHAN, RaidDifficulty.NORMAL)

        case "417231112": case "508802457": case "757116822": case "771164842":
        case "1685065161": case "1800508819": case "2449714930": case "3446541099":
        case "4206123728": case "3912437239": case "3879860661": case "3857338478":
            return new RaidInfo(Raid.LEVIATHAN, RaidDifficulty.PRESTIGE)

        case "2164432138": case "3089205900":
            return new RaidInfo(Raid.EATER_OF_WORLDS, RaidDifficulty.NORMAL)

        case "809170886":
            return new RaidInfo(Raid.EATER_OF_WORLDS, RaidDifficulty.PRESTIGE)

        case "119944200": case "3004605630":
            return new RaidInfo(Raid.SPIRE_OF_STARS, RaidDifficulty.NORMAL)

        case "3213556450":
            return new RaidInfo(Raid.SPIRE_OF_STARS, RaidDifficulty.PRESTIGE)

        case "1661734046": case "2122313384": case "2214608157":
            return new RaidInfo(Raid.LAST_WISH, RaidDifficulty.NORMAL)

        case "2812525063": case "548750096":
            return new RaidInfo(Raid.SCOURGE_OF_THE_PAST, RaidDifficulty.NORMAL)

        case "960175301": case "3333172150":
            return new RaidInfo(Raid.CROWN_OF_SORROW, RaidDifficulty.NORMAL)

        case "2497200493": case "2659723068": case "3458480158": case "3845997235":
            return new RaidInfo(Raid.GARDEN_OF_SALVATION, RaidDifficulty.NORMAL)

        case "910380154": case "3976949817":
            return new RaidInfo(Raid.DEEP_STONE_CRYPT, RaidDifficulty.NORMAL)

        case "3711931140": case "3881495763":
            return new RaidInfo(Raid.VAULT_OF_GLASS, RaidDifficulty.NORMAL)

        case "1485585878":
            return new RaidInfo(Raid.VAULT_OF_GLASS, RaidDifficulty.CHALLENGEVOG)

        case "1681562271": case "3022541210":
            return new RaidInfo(Raid.VAULT_OF_GLASS, RaidDifficulty.MASTER)

        case "1441982566": case "2906950631": case "4156879541":
            return new RaidInfo(Raid.VOW_OF_THE_DISCIPLE, RaidDifficulty.NORMAL)

        case "4217492330":
            return new RaidInfo(Raid.VOW_OF_THE_DISCIPLE, RaidDifficulty.MASTER)

        case "1374392663": case "2897223272":
            return new RaidInfo(Raid.KINGS_FALL, RaidDifficulty.NORMAL)

        case "1063970578":
            return new RaidInfo(Raid.KINGS_FALL, RaidDifficulty.CHALLENGEKF)

        case "2964135793":
            return new RaidInfo(Raid.KINGS_FALL, RaidDifficulty.MASTER)

        case "1191701339": case "2381413764":
            return new RaidInfo(Raid.ROOT_OF_NIGHTMARES, RaidDifficulty.NORMAL)

        case "2918919505":
            return new RaidInfo(Raid.ROOT_OF_NIGHTMARES, RaidDifficulty.MASTER)

        default:
            return new RaidInfo(Raid.NA, RaidDifficulty.NORMAL)
    }
}

export const RaidCardBackground: { [key in Raid]: string } = {
    [Raid.LEVIATHAN]: "/card-backgrounds/levi.png",
    [Raid.EATER_OF_WORLDS]: "/card-backgrounds/eow.png",
    [Raid.SPIRE_OF_STARS]: "/card-backgrounds/spire.png",
    [Raid.LAST_WISH]: "/card-backgrounds/wish.png",
    [Raid.SCOURGE_OF_THE_PAST]: "/card-backgrounds/sotp.png",
    [Raid.CROWN_OF_SORROW]: "/card-backgrounds/crown.png",
    [Raid.GARDEN_OF_SALVATION]: "/card-backgrounds/gos.png",
    [Raid.DEEP_STONE_CRYPT]: "/card-backgrounds/dsc.png",
    [Raid.VAULT_OF_GLASS]: "/card-backgrounds/vog.png",
    [Raid.VOW_OF_THE_DISCIPLE]: "/card-backgrounds/vow.png",
    [Raid.KINGS_FALL]: "/card-backgrounds/kf.png",
    [Raid.ROOT_OF_NIGHTMARES]: "/card-backgrounds/ron.png",
    [Raid.NA]: "/card-backgrounds/dne.png",
}

export const Backdrop: { [key in Raid]: HTMLAttributes<HTMLDivElement>['style'] } = {
    [Raid.LEVIATHAN]: {
        backgroundImage: `url(${RaidCardBackground[Raid.LEVIATHAN]})`,
        opacity: 0.4
    },
    [Raid.EATER_OF_WORLDS]: {
        backgroundImage: `url(${RaidCardBackground[Raid.EATER_OF_WORLDS]})`,
        opacity: 0.4
    },
    [Raid.SPIRE_OF_STARS]: {
        backgroundImage: `url(${RaidCardBackground[Raid.SPIRE_OF_STARS]})`,
        opacity: 0.4
    },
    [Raid.LAST_WISH]: {
        backgroundImage: `url(${RaidCardBackground[Raid.LAST_WISH]})`,
        opacity: 0.2
    },
    [Raid.SCOURGE_OF_THE_PAST]: {
        backgroundImage: `url(${RaidCardBackground[Raid.SCOURGE_OF_THE_PAST]})`,
        opacity: 0.4
    },
    [Raid.CROWN_OF_SORROW]: {
        backgroundImage: `url(${RaidCardBackground[Raid.CROWN_OF_SORROW]})`,
        opacity: 0.4
    },
    [Raid.GARDEN_OF_SALVATION]: {
        backgroundImage: `url(${RaidCardBackground[Raid.GARDEN_OF_SALVATION]})`,
        opacity: 0.4
    },
    [Raid.DEEP_STONE_CRYPT]: {
        backgroundImage: `url(${RaidCardBackground[Raid.DEEP_STONE_CRYPT]})`,
        opacity: 0.8
    },
    [Raid.VAULT_OF_GLASS]: {
        backgroundImage: `url(${RaidCardBackground[Raid.VAULT_OF_GLASS]})`,
        opacity: 0.4
    },
    [Raid.VOW_OF_THE_DISCIPLE]: {
        backgroundImage: `url(${RaidCardBackground[Raid.VOW_OF_THE_DISCIPLE]})`,
        opacity: 0.4
    },
    [Raid.KINGS_FALL]: {
        backgroundImage: `url(${RaidCardBackground[Raid.KINGS_FALL]})`,
        opacity: 0.4
    },
    [Raid.ROOT_OF_NIGHTMARES]: {
        backgroundImage: `url(${RaidCardBackground[Raid.ROOT_OF_NIGHTMARES]})`,
        opacity: 0.6
    },
    [Raid.NA]: {
        backgroundImage: `url(${RaidCardBackground[Raid.NA]})`,
        opacity: 0.4
    },
}

export const RaidBanner: { [key in Raid]: string } = {
    [Raid.LEVIATHAN]: "/banners/levi.png",
    [Raid.EATER_OF_WORLDS]: "/banners/eow.png",
    [Raid.SPIRE_OF_STARS]: "/banners/spire.png",
    [Raid.LAST_WISH]: "/banners/wish.png",
    [Raid.SCOURGE_OF_THE_PAST]: "/banners/sotp.png",
    [Raid.CROWN_OF_SORROW]: "/banners/crown.png",
    [Raid.GARDEN_OF_SALVATION]: "/banners/gos.png",
    [Raid.DEEP_STONE_CRYPT]: "/banners/dsc.png",
    [Raid.VAULT_OF_GLASS]: "/banners/vog.png",
    [Raid.VOW_OF_THE_DISCIPLE]: "/banners/vow.png",
    [Raid.KINGS_FALL]: "/banners/kf.png",
    [Raid.ROOT_OF_NIGHTMARES]: "/banners/ron.png",
    [Raid.NA]: "",
}

export const ContestEnd: Partial<Record<Raid, Date>> = {
    [Raid.CROWN_OF_SORROW]: new Date('June 5, 2019 4:00:00 PM PDT'),
    [Raid.GARDEN_OF_SALVATION]: new Date('October 6, 2019 10:00:00 AM PDT'),
    [Raid.DEEP_STONE_CRYPT]: new Date('November 22, 2020 10:00:00 AM PST'),
    [Raid.VAULT_OF_GLASS]: new Date('May 23, 2021 10:00:00 AM PDT'),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date('March 7, 2022 10:00:00 AM PST'),
    [Raid.KINGS_FALL]: new Date('August 27, 2022 10:00:00 AM PDT'),
    [Raid.ROOT_OF_NIGHTMARES]: new Date('March 12, 2023 9:00:00 AM PST')
}

export const DayOneEnd: Partial<Record<Raid, Date>> = {
    [Raid.LEVIATHAN]: new Date('September 14, 2017 10:00:00 AM PDT'),
    [Raid.EATER_OF_WORLDS]: new Date('December 9th, 2017 10:00:00 AM PST'),
    [Raid.SPIRE_OF_STARS]: new Date('May 12, 2018 10:00:00 AM PDT'),
    [Raid.LAST_WISH]: new Date('September 15, 2018 10:00:00 AM PDT'),
    [Raid.SCOURGE_OF_THE_PAST]: new Date('December 8, 2018 9:00:00 AM PST'),
    [Raid.CROWN_OF_SORROW]: new Date('June 5, 2019 4:00:00 PM PDT'),
    [Raid.GARDEN_OF_SALVATION]: new Date('October 6, 2019 10:00:00 AM PDT'),
    [Raid.DEEP_STONE_CRYPT]: new Date('November 22, 2020 10:00:00 AM PST'),
    [Raid.VAULT_OF_GLASS]: new Date('May 23, 2021 10:00:00 AM PDT'),
    [Raid.VOW_OF_THE_DISCIPLE]: new Date('March 6, 2022 10:00:00 AM PST'),
    [Raid.KINGS_FALL]: new Date('August 27, 2022 10:00:00 AM PDT'),
    [Raid.ROOT_OF_NIGHTMARES]: new Date('March 11, 2023 9:00:00 AM PST')
}