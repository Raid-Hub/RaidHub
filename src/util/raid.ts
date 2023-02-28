export enum Raid {
    Leviathan = "Leviathan",
    EaterOfWorlds = "Eater of Worlds",
    SpireOfStars = "Spire of Stars",
    LastWish = "Last Wish",
    ScourgeOfThePast = "Scourge of the Past",
    CrownOfSorrow = "Crown of Sorrow",
    GardenOfSalvation = "Garden of Salvation",
    DeepStoneCrypt = "Deep Stone Crypt",
    VaultOfGlass = "Vault of Glass",
    VowOfTheDisciple = "Vow of the Disciple",
    KingsFall = "King's Fall",
    RootOfNightmares = "Root of Nightmares",
    NA = "Non-raid"
}

export enum RaidDifficulty {
    Normal,
    Prestige,
    Contest,
    Master,
    ChallengeVog,
    ChallengeKF,
}

const ContestRaidDifficulties = [RaidDifficulty.ChallengeVog, RaidDifficulty.ChallengeKF]

export class RaidInfo {
    name: Raid
    difficulty: RaidDifficulty
    constructor(name: Raid, difficulty: RaidDifficulty) {
        this.name = name
        this.difficulty = difficulty
    }
    isDayOne(ended: Date): boolean {
        if (DayOneEnd[this.name] === undefined) {
            return false;
        } else {
            return ended.getTime() <= DayOneEnd[this.name]!.getTime()
        }
    }

    isContest(started: Date): boolean {
        console.log(started)
        if (ContestEnd[this.name] === undefined) {
            return false;
        } else if (ContestRaidDifficulties.includes(this.difficulty)) {
            return true
        } else {
            return started.getTime() < ContestEnd[this.name]!.getTime()
        }
    }
}

export function raidFromHash (hash: string): RaidInfo {
    switch (hash) {
        case "89727599": case "287649202": case "1699948563": case "1875726950":
        case "2693136600": case "2693136601": case "2693136602": case "2693136603":
        case "2693136604": case "2693136605": case "3916343513": case "4039317196":
            return new RaidInfo(Raid.Leviathan, RaidDifficulty.Normal)

        case "417231112": case "508802457": case "757116822": case "771164842":
        case "1685065161": case "1800508819": case "2449714930": case "3446541099":
        case "4206123728": case "3912437239": case "3879860661": case "3857338478":
            return new RaidInfo(Raid.Leviathan, RaidDifficulty.Prestige)

        case "2164432138": case "3089205900":
            return new RaidInfo(Raid.EaterOfWorlds, RaidDifficulty.Normal)

        case "809170886":
            return new RaidInfo(Raid.EaterOfWorlds, RaidDifficulty.Prestige)

        case "119944200": case "3004605630":
            return new RaidInfo(Raid.SpireOfStars, RaidDifficulty.Normal)

        case "3213556450":
            return new RaidInfo(Raid.SpireOfStars, RaidDifficulty.Prestige)

        case "1661734046": case "2122313384": case "2214608157":
            return new RaidInfo(Raid.LastWish, RaidDifficulty.Normal)

        case "2812525063": case "548750096":
            return new RaidInfo(Raid.ScourgeOfThePast, RaidDifficulty.Normal)

        case "960175301": case "3333172150":
            return new RaidInfo(Raid.CrownOfSorrow, RaidDifficulty.Normal)

        case "2497200493": case "2659723068": case "3458480158": case "3845997235":
            return new RaidInfo(Raid.GardenOfSalvation, RaidDifficulty.Normal)

        case "910380154": case "3976949817":
            return new RaidInfo(Raid.DeepStoneCrypt, RaidDifficulty.Normal)

        case "3711931140": case "3881495763":
            return new RaidInfo(Raid.VaultOfGlass, RaidDifficulty.Normal)

        case "1485585878":
            return new RaidInfo(Raid.VaultOfGlass, RaidDifficulty.ChallengeVog)

        case "1681562271":
            return new RaidInfo(Raid.VaultOfGlass, RaidDifficulty.Master)

        case "1441982566": case "2906950631": case "4156879541":
            return new RaidInfo(Raid.VowOfTheDisciple, RaidDifficulty.Normal)

        case "4217492330":
            return new RaidInfo(Raid.VowOfTheDisciple, RaidDifficulty.Master)

        case "1374392663": case "2897223272":
            return new RaidInfo(Raid.KingsFall, RaidDifficulty.Normal)

        case "1063970578":
            return new RaidInfo(Raid.KingsFall, RaidDifficulty.ChallengeKF)

        case "2964135793":
            return new RaidInfo(Raid.KingsFall, RaidDifficulty.Master)

        default:
            return new RaidInfo(Raid.NA, RaidDifficulty.Normal)
    }
}

// TODO
export const Backdrop: { [key in Raid]: string } = {
    [Raid.Leviathan]: "/dne.png",
    [Raid.EaterOfWorlds]: "/dne.png",
    [Raid.SpireOfStars]: "/dne.png",
    [Raid.LastWish]: "/dne.png",
    [Raid.ScourgeOfThePast]: "/dne.png",
    [Raid.CrownOfSorrow]: "/dne.png",
    [Raid.GardenOfSalvation]: "/dne.png",
    [Raid.DeepStoneCrypt]: "/dne.png",
    [Raid.VaultOfGlass]: "/dne.png",
    [Raid.VowOfTheDisciple]: "/vow.png",
    [Raid.KingsFall]: "/kf.png",
    [Raid.RootOfNightmares]: "/dne.png",
    [Raid.NA]: "/dne.png",
}

export const ColorFilm: { [key in Raid]: string } = {
    [Raid.Leviathan]: "",
    [Raid.EaterOfWorlds]: "",
    [Raid.SpireOfStars]: "",
    [Raid.LastWish]: "",
    [Raid.ScourgeOfThePast]: "",
    [Raid.CrownOfSorrow]: "",
    [Raid.GardenOfSalvation]: "",
    [Raid.DeepStoneCrypt]: "",
    [Raid.VaultOfGlass]: "",
    [Raid.VowOfTheDisciple]: "color-film-vow",
    [Raid.KingsFall]: "color-film-kf",
    [Raid.RootOfNightmares]: "",
    [Raid.NA]: "",
}

export const ContestEnd: Partial<Record<Raid, Date>> = {
    [Raid.CrownOfSorrow]: new Date('June 5, 2019 4:00:00 PM PDT'),
    [Raid.GardenOfSalvation]: new Date('October 6, 2019 10:00:00 AM PDT'),
    [Raid.DeepStoneCrypt]: new Date('November 22, 2020 10:00:00 AM PST'),
    [Raid.VaultOfGlass]: new Date('May 23, 2021 10:00:00 AM PDT'),
    [Raid.VowOfTheDisciple]: new Date('March 7, 2022 10:00:00 AM PST'),
    [Raid.KingsFall]: new Date('August 27, 2022 10:00:00 AM PDT'),
    [Raid.RootOfNightmares]: new Date('March 12, 2022 9:00:00 AM PST')
}

export const DayOneEnd: Partial<Record<Raid, Date>> = {
    [Raid.Leviathan]: new Date('September 14, 2017 10:00:00 AM PDT'),
    [Raid.EaterOfWorlds]: new Date('December 9th, 2017 10:00:00 AM PST'),
    [Raid.SpireOfStars]: new Date('May 12, 2018 10:00:00 AM PDT'),
    [Raid.LastWish]: new Date('September 15, 2018 10:00:00 AM PDT'),
    [Raid.ScourgeOfThePast]: new Date('December 8, 2018 9:00:00 AM PST'),
    [Raid.CrownOfSorrow]: new Date('June 5, 2019 4:00:00 PM PDT'),
    [Raid.GardenOfSalvation]: new Date('October 6, 2019 10:00:00 AM PDT'),
    [Raid.DeepStoneCrypt]: new Date('November 22, 2020 10:00:00 AM PST'),
    [Raid.VaultOfGlass]: new Date('May 23, 2021 10:00:00 AM PDT'),
    [Raid.VowOfTheDisciple]: new Date('March 6, 2022 10:00:00 AM PST'),
    [Raid.KingsFall]: new Date('August 27, 2022 10:00:00 AM PDT'),
    [Raid.RootOfNightmares]: new Date('March 11, 2023 9:00:00 AM PST')
}