import { DestinyInventoryItemDefinition } from "bungie-net-core/models"

const baseBungieUrl = "https://www.bungie.net"

const defaultIcon = "/img/profile/avatars/default_avatar.gif"
export function bungieIconUrl(path: string | undefined | null) {
    return baseBungieUrl + (path || defaultIcon)
}

export function bungieItemUrl(path: string | undefined) {
    return baseBungieUrl + (path || "")
}

const defaultEmblem = "/common/destiny2_content/icons/2644a073545e566485629b95989b5f83.jpg"
export function emblemUrl(path: string | undefined) {
    return baseBungieUrl + (path || defaultEmblem)
}

const defaultBannerEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"
export function bannerEmblemUrl(emblem: DestinyInventoryItemDefinition | null) {
    return baseBungieUrl + (emblem?.secondarySpecial || defaultBannerEmblem)
}

export function clanBannerBannerLayerUrl(path: string | undefined) {
    return baseBungieUrl + (path || "")
}
