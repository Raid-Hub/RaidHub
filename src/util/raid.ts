import { DayOneEnd, ContestEnd } from './dates'

export type RaidInfo = {
    name: string,
    difficulty: RaidDifficulty
    isDayOne: (ended: Date) => boolean
    isContest: (started: Date) => boolean
}

enum RaidName {
    leviathan = "Leviathan",
    eaterOfWorlds = "Eater of Worlds",
    spireOfStars = "Spire of Stars",
    lastWish = "Last Wish",
    scourgeOfThePast = "Scourge of the Past",
    crownOfSorrow = "Crown of Sorrow",
    gardenOfSalvation = "Garden of Salvation",
    deepStoneCrypt = "Deep Stone Crypt",
    vaultOfGlass = "Vault of Glass",
    vowOfTheDisciple = "Vow of the Disciple",
    kingsFall = "King's Fall",
    lightfall = "Lightfall Raid",
    na = "Non-raid"
}

export enum RaidDifficulty {
    normal,
    prestige,
    legend,
    master,
    contest,
    challengeKF,
    challengeVog,
    na
}

const IsContest: { [raid: string]: (start: Date) => boolean } = {
    na: (start: Date) => false,
    yes: (start: Date) => true,
    crownOfSorrow: (start: Date) => start.getTime() < ContestEnd.crownOfSorrow.getTime(),
    gardenOfSalvation: (start: Date) => start.getTime() < ContestEnd.gardenOfSalvation.getTime(),
    deepStoneCrypt: (start: Date) => start.getTime() < ContestEnd.deepStoneCrypt.getTime(),
    vaultOfGlass: (start: Date) => start.getTime() < ContestEnd.vaultOfGlass.getTime(),
    vowOfTheDisciple: (start: Date) => start.getTime() < ContestEnd.vowOfTheDisciple.getTime(),
    kingsFall: (start: Date) => start.getTime() < ContestEnd.kingsFall.getTime(),
    lightfallRaid: (start: Date) => start.getTime() < ContestEnd.lightfallRaid.getTime()
}

const IsDayOne: { [raid: string]: (end: Date) => boolean } = {
    na: (end: Date) => false,
    leivathan: (end: Date) => end.getTime() <= DayOneEnd.leivathan.getTime(),
    eaterOfWorlds: (end: Date) => end.getTime() <= DayOneEnd.eaterOfWorlds.getTime(),
    spireOfStars: (end: Date) => end.getTime() <= DayOneEnd.spireOfStars.getTime(),
    lastWish: (end: Date) => end.getTime() <= DayOneEnd.lastWish.getTime(),
    scourgeOfThePast: (end: Date) => end.getTime() <= DayOneEnd.scourgeOfThePast.getTime(),
    crownOfSorrow: (end: Date) => end.getTime() <= DayOneEnd.crownOfSorrow.getTime(),
    gardenOfSalvation: (end: Date) => end.getTime() <= DayOneEnd.gardenOfSalvation.getTime(),
    deepStoneCrypt: (end: Date) => end.getTime() <= DayOneEnd.deepStoneCrypt.getTime(),
    vaultOfGlass: (end: Date) => end.getTime() <= DayOneEnd.vaultOfGlass.getTime(),
    vowOfTheDisciple: (end: Date) => end.getTime() <= DayOneEnd.vowOfTheDisciple.getTime(),
    kingsFall: (end: Date) => end.getTime() <= DayOneEnd.kingsFall.getTime(),
    lightfallRaid: (end: Date) => end.getTime() <= DayOneEnd.lightfallRaid.getTime()
}

export const raidFromHash = (hash: string): RaidInfo => {
    switch (hash) {
        case "89727599": case "287649202": case "1699948563": case "1875726950":
        case "2693136600": case "2693136601": case "2693136602": case "2693136603":
        case "2693136604": case "2693136605": case "3916343513": case "4039317196": return {
            name: RaidName.leviathan,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.na,
            isDayOne: IsDayOne.leivathan
        }
        case "417231112": case "508802457": case "757116822": case "771164842":
        case "1685065161": case "1800508819": case "2449714930": case "3446541099":
        case "4206123728": case "3912437239": case "3879860661": case "3857338478": return {
            name: RaidName.leviathan,
            difficulty: RaidDifficulty.prestige,
            isContest: IsContest.na,
            isDayOne: IsDayOne.na
        }
        case "2164432138": case "3089205900": return {
            name: RaidName.eaterOfWorlds,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.na,
            isDayOne: IsDayOne.eaterOfWorlds
        }
        case "809170886": return {
            name: RaidName.eaterOfWorlds,
            difficulty: RaidDifficulty.prestige,
            isContest: IsContest.na,
            isDayOne: IsDayOne.na
        }
        case "119944200": case "3004605630": return {
            name: RaidName.spireOfStars,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.na,
            isDayOne: IsDayOne.spireOfStars
        }
        case "3213556450": return {
            name: RaidName.spireOfStars,
            difficulty: RaidDifficulty.prestige,
            isContest: IsContest.na,
            isDayOne: IsDayOne.na
        }
        case "1661734046": case "2122313384": case "2214608157": return {
            name: RaidName.lastWish,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.na,
            isDayOne: IsDayOne.lastWish
        }
        case "2812525063": case "548750096": return {
            name: RaidName.scourgeOfThePast,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.na,
            isDayOne: IsDayOne.scourgeOfThePast
        }
        case "960175301": case "3333172150": return {
            name: RaidName.crownOfSorrow,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.crownOfSorrow,
            isDayOne: IsDayOne.crownOfSorrow
        }
        case "2497200493": case "2659723068": case "3458480158": case "3845997235": return {
            name: RaidName.gardenOfSalvation,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.gardenOfSalvation,
            isDayOne: IsDayOne.gardenOfSalvation
        }
        case "910380154": case "3976949817": return {
            name: RaidName.deepStoneCrypt,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.deepStoneCrypt,
            isDayOne: IsDayOne.deepStoneCrypt
        }
        case "3711931140": case "3881495763": return {
            name: RaidName.vaultOfGlass,
            difficulty: RaidDifficulty.legend,
            isContest: IsContest.vaultOfGlass,
            isDayOne: IsDayOne.vaultOfGlass
        }
        case "1485585878": return {
            name: RaidName.vaultOfGlass,
            difficulty: RaidDifficulty.challengeVog,
            isContest: IsContest.yes,
            isDayOne: IsDayOne.vaultOfGlass
        }
        case "1681562271": return {
            name: RaidName.vaultOfGlass,
            difficulty: RaidDifficulty.master,
            isContest: IsContest.na,
            isDayOne: IsDayOne.na
        }
        case "1441982566": case "2906950631": case "4156879541": return {
            name: RaidName.vowOfTheDisciple,
            difficulty: RaidDifficulty.legend,
            isContest: IsContest.vowOfTheDisciple,
            isDayOne: IsDayOne.vowOfTheDisciple
        }
        case "4217492330": return {
            name: RaidName.vowOfTheDisciple,
            difficulty: RaidDifficulty.master,
            isContest: IsContest.na,
            isDayOne: IsDayOne.na
        }
        case "1374392663": case "2897223272": return {
            name: RaidName.kingsFall,
            difficulty: RaidDifficulty.normal,
            isContest: IsContest.kingsFall,
            isDayOne: IsDayOne.kingsFall
        }
        case "1063970578": return {
            name: RaidName.kingsFall,
            difficulty: RaidDifficulty.challengeKF,
            isContest: IsContest.yes,
            isDayOne: IsDayOne.kingsFall
        }
        case "2964135793": return {
            name: RaidName.kingsFall,
            difficulty: RaidDifficulty.master,
            isContest: IsContest.na,
            isDayOne: IsDayOne.na
        }
        default: return {
            name: RaidName.na,
            difficulty: RaidDifficulty.na,
            isContest: IsContest.na,
            isDayOne: IsDayOne.na
        }
    }
}

export enum Backdrop {
    leviathan = "/vow.png",
    eaterOfWorlds = "/vow.png",
    spireOfStars = "/vow.png",
    lastWish = "/vow.png",
    scourgeOfThePast = "/vow.png",
    crownOfSorrow = "/vow.png",
    gardenOfSalvation = "/vow.png",
    deepStoneCrypt = "/vow.png",
    vaultOfGlass = "/vow.png",
    vowOfTheDisciple = "/vow.png",
    kingsFall = "/vow.png",
    lightfall = "/vow.png",
    na = "/vow.png"
}