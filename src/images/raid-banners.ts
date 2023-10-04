import { ListedRaid, Raid } from "../types/raids"

const RaidBanners: { [key in ListedRaid]: string } = {
    /** The ID of the image on Cloudflare */
    [Raid.LEVIATHAN]: "9db125d2-af41-4981-1b89-39965dd86700",
    [Raid.EATER_OF_WORLDS]: "61790ffe-aead-4997-69c5-a49b5e534700",
    [Raid.SPIRE_OF_STARS]: "2a4fdb82-becc-4385-d585-f5e09e244f00",
    [Raid.LAST_WISH]: "c177d9ce-f07c-4500-60af-03ccc4185d00",
    [Raid.SCOURGE_OF_THE_PAST]: "140e450d-5ef8-4e05-a678-2a37d91e0900",
    [Raid.CROWN_OF_SORROW]: "ad8d1f83-f6d2-4a30-ff9e-7d7112002f00",
    [Raid.GARDEN_OF_SALVATION]: "4fc3f367-ee5d-49d3-0a81-750042a13f00",
    [Raid.DEEP_STONE_CRYPT]: "7a1de99d-4279-4f79-fdb6-235594246e00",
    [Raid.VAULT_OF_GLASS]: "3a90571e-ae1c-4281-e13c-5bfe4d133600",
    [Raid.VOW_OF_THE_DISCIPLE]: "a6c9d68a-2649-4b5c-de2e-81347db5bb00",
    [Raid.KINGS_FALL]: "78f50806-596f-4065-193f-da4e7e936700",
    [Raid.ROOT_OF_NIGHTMARES]: "7e04c607-223e-4771-4ebe-c96dde187900",
    [Raid.CROTAS_END]: "c6a7d45b-f976-4afb-58f3-14891ea7dc00"
}

export default RaidBanners
