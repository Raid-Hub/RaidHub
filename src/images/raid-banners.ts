import { Raid } from "../types/raids"
import { StaticImageData } from "next/image"
import levi from "../../public/banners/levi.png"
import eow from "../../public/banners/eow.png"
import spire from "../../public/banners/spire.png"
import wish from "../../public/banners/wish.png"
import sotp from "../../public/banners/sotp.png"
import crown from "../../public/banners/crown.png"
import gos from "../../public/banners/gos.png"
import dsc from "../../public/banners/dsc.png"
import vog from "../../public/banners/vog.png"
import vow from "../../public/banners/vow.png"
import kf from "../../public/banners/kf.png"
import ron from "../../public/banners/ron.png"
import dne from "../../public/banners/dne.png"

const RaidBanners: { [key in Raid]: StaticImageData } = {
    [Raid.LEVIATHAN]: levi,
    [Raid.EATER_OF_WORLDS]: eow,
    [Raid.SPIRE_OF_STARS]: spire,
    [Raid.LAST_WISH]: wish,
    [Raid.SCOURGE_OF_THE_PAST]: sotp,
    [Raid.CROWN_OF_SORROW]: crown,
    [Raid.GARDEN_OF_SALVATION]: gos,
    [Raid.DEEP_STONE_CRYPT]: dsc,
    [Raid.VAULT_OF_GLASS]: vog,
    [Raid.VOW_OF_THE_DISCIPLE]: vow,
    [Raid.KINGS_FALL]: kf,
    [Raid.ROOT_OF_NIGHTMARES]: ron,
    [Raid.CROTAS_END]: dne,
    [Raid.NA]: dne
}

export default RaidBanners
