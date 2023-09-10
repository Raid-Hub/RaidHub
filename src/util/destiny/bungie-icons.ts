import { DestinyInventoryItemDefinition } from "bungie-net-core/models"

const baseBungieUrl = "https://www.bungie.net"

const defaultBannerEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"
export function bannerEmblem(emblem: DestinyInventoryItemDefinition | null) {
    return baseBungieUrl + (emblem?.secondarySpecial ?? defaultBannerEmblem)
}
