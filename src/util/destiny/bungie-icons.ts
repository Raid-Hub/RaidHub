import { DestinyInventoryItemDefinition } from "bungie-net-core/models"

const baseBungieUrl = "https://www.bungie.net"

const defaultBannerEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"
export function bannerEmblem(emblem: DestinyInventoryItemDefinition | null) {
    return baseBungieUrl + (emblem?.secondarySpecial ?? defaultBannerEmblem)
}

const defaultEmblem = "common/destiny2_content/icons/2644a073545e566485629b95989b5f83.jpg"

export function emblemUrl(path: string | undefined) {
    return baseBungieUrl + (path ?? defaultEmblem)
}

const defaultIcon = "/img/profile/avatars/default_avatar.gif"
export function iconUrl(path: string | undefined) {
    return baseBungieUrl + (path ?? defaultIcon)
}
