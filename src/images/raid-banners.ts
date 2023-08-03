import { AvailableRaid, Raid } from "../types/raids"
import { StaticImageData } from "next/image"

const RaidBanners: { [key in AvailableRaid]: StaticImageData | string } = {
    [Raid.LEVIATHAN]:
        "https://media.discordapp.net/attachments/1136751502912934060/1136768967977996439/levi.jpg?width=2160&height=338",
    [Raid.EATER_OF_WORLDS]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136767516400697435/eow.jpg",
    [Raid.SPIRE_OF_STARS]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136771008439779389/spire.jpg",
    [Raid.LAST_WISH]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136772097167863888/wish.jpg",
    [Raid.SCOURGE_OF_THE_PAST]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136772993771655270/scourge.jpg",
    [Raid.CROWN_OF_SORROW]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136773497343987764/crown.jpg",
    [Raid.GARDEN_OF_SALVATION]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136764593658675281/gos.jpg",
    [Raid.DEEP_STONE_CRYPT]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136773960193814579/dsc.jpg",
    [Raid.VAULT_OF_GLASS]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136774324280365166/vog.jpg",
    [Raid.VOW_OF_THE_DISCIPLE]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136775741346951318/vow.jpg",
    [Raid.KINGS_FALL]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136776084487159878/kf.jpg",
    [Raid.ROOT_OF_NIGHTMARES]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136764576491380746/ron.jpg"
}

export default RaidBanners
