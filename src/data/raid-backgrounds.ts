import { Raid } from "~/data/raid"

const RaidCardBackground: { [key in number]: string } = {
    /** The ID of the image on Cloudflare */
    [Raid.LEVIATHAN]: "c5d17820-4d9e-4de4-cc6b-3c6fab866d00",
    [Raid.EATER_OF_WORLDS]: "9ac2c107-52ca-4299-e976-be52d1044600",
    [Raid.SPIRE_OF_STARS]: "1a32e743-68e2-4c96-0cb4-57f350f91f00",
    [Raid.LAST_WISH]: "e62b1da9-86a2-44c3-da9c-4d89b6de0b00",
    [Raid.SCOURGE_OF_THE_PAST]: "c44ff05d-cf5d-4b59-a152-30b683ed1400",
    [Raid.CROWN_OF_SORROW]: "dd4efc94-cb8c-40fe-dcde-1b6338c3db00",
    [Raid.GARDEN_OF_SALVATION]: "32ea0eeb-fb59-4cad-8809-804692f9fe00",
    [Raid.DEEP_STONE_CRYPT]: "2c94b6db-d387-4197-fe80-edb942bbc000",
    [Raid.VAULT_OF_GLASS]: "d04307fd-6b3a-4aa7-cb78-c853bc494700",
    [Raid.VOW_OF_THE_DISCIPLE]: "692acf5e-7de4-4b47-1884-4b878be43000",
    [Raid.KINGS_FALL]: "34d48e44-7a1d-4e03-23fc-1dc3de934d00",
    [Raid.ROOT_OF_NIGHTMARES]: "2a2e9ea3-b0f6-449e-6f5d-ec03f0f40d00",
    [Raid.CROTAS_END]: "5f3e8b20-3694-4899-a89c-fa2fb992f900"
}

export default RaidCardBackground
