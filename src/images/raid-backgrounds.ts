import { Raid } from "../types/raids"
import { StaticImageData } from "next/image"
import levi from "../../public/card-backgrounds/levi.png"
import eow from "../../public/card-backgrounds/eow.png"
import spire from "../../public/card-backgrounds/spire.png"
import wish from "../../public/card-backgrounds/wish.png"
import sotp from "../../public/card-backgrounds/sotp.png"
import crown from "../../public/card-backgrounds/crown.png"
import gos from "../../public/card-backgrounds/gos.png"
import dsc from "../../public/card-backgrounds/dsc.png"
import vog from "../../public/card-backgrounds/vog.png"
import vow from "../../public/card-backgrounds/vow.png"
import kf from "../../public/card-backgrounds/kf.png"
import ron from "../../public/card-backgrounds/ron.png"
import dne from "../../public/card-backgrounds/dne.png"

const RaidCardBackground: { [key in Raid]: StaticImageData } = {
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

export default RaidCardBackground
