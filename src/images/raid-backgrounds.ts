import { ListedRaid, Raid } from "../types/raids"
import { StaticImageData } from "next/image"

const RaidCardBackground: { [key in ListedRaid]: StaticImageData | string } = {
    [Raid.LEVIATHAN]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136752390440222741/leviathan.webp",
    [Raid.EATER_OF_WORLDS]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136757251164610671/eow.webp",
    [Raid.SPIRE_OF_STARS]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136757287499857927/spire.webp",
    [Raid.LAST_WISH]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136757369624330420/wish.webp",
    [Raid.SCOURGE_OF_THE_PAST]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136757444547198976/scourge.webp",
    [Raid.CROWN_OF_SORROW]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136757499236729003/crown.webp",
    [Raid.GARDEN_OF_SALVATION]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136758744873709800/gos.webp",
    [Raid.DEEP_STONE_CRYPT]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136758985257668679/dsc.webp",
    [Raid.VAULT_OF_GLASS]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136759024533118997/vog.webp",
    [Raid.VOW_OF_THE_DISCIPLE]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136759044158275654/vow.webp",
    [Raid.KINGS_FALL]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136759064278347887/kf.webp",
    [Raid.ROOT_OF_NIGHTMARES]:
        "https://cdn.discordapp.com/attachments/1136751502912934060/1136759097253970030/ron.webp"
}

export default RaidCardBackground
