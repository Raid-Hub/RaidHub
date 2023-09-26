import { ListedRaid, Raid } from "~/types/raids"

const RaidCardBackground: { [key in ListedRaid]: string } = {
    /** The ID of the image on Cloudflare */
    [Raid.LEVIATHAN]: "c5d17820-4d9e-4de4-cc6b-3c6fab866d00",
    [Raid.EATER_OF_WORLDS]: "df3cc4cd-24b5-4765-1199-bbedbfdea100",
    [Raid.SPIRE_OF_STARS]: "1a32e743-68e2-4c96-0cb4-57f350f91f00",
    [Raid.LAST_WISH]: "b4b02589-dda0-4f48-1f0d-e220a2336000",
    [Raid.SCOURGE_OF_THE_PAST]: "745767d6-5106-4540-9fd0-69b118946100",
    [Raid.CROWN_OF_SORROW]: "dd4efc94-cb8c-40fe-dcde-1b6338c3db00",
    [Raid.GARDEN_OF_SALVATION]: "27396ec8-86d1-4d61-3ecd-3de40d6c5300",
    [Raid.DEEP_STONE_CRYPT]: "2c94b6db-d387-4197-fe80-edb942bbc000",
    [Raid.VAULT_OF_GLASS]: "5b627e5b-92ca-4273-624d-1a3176ee0900",
    [Raid.VOW_OF_THE_DISCIPLE]: "692acf5e-7de4-4b47-1884-4b878be43000",
    [Raid.KINGS_FALL]: "34d48e44-7a1d-4e03-23fc-1dc3de934d00",
    [Raid.ROOT_OF_NIGHTMARES]: "2a2e9ea3-b0f6-449e-6f5d-ec03f0f40d00",
    [Raid.CROTAS_END]: "5f3e8b20-3694-4899-a89c-fa2fb992f900"
}

export default RaidCardBackground
