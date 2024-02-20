/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { type DestinyInventoryItemDefinition } from "bungie-net-core/models"

const baseBungieUrl = "https://www.bungie.net"

const defaultIcon = "/img/profile/avatars/default_avatar.gif"
const defaultEmblem = "/common/destiny2_content/icons/2644a073545e566485629b95989b5f83.jpg"
const defaultBannerEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"
const defaultPgcrImage = "/img/destiny_content/pgcr/social_traveler.jpg"

export function bungieIconUrl(path: string | undefined | null) {
    return baseBungieUrl + (path || defaultIcon)
}

export function bungieItemUrl(path: string | undefined) {
    return baseBungieUrl + (path || "")
}

export function bungieEmblemUrl(path: string | undefined) {
    return baseBungieUrl + (path || defaultEmblem)
}

export function bungieBannerEmblemUrl(emblem: DestinyInventoryItemDefinition | null) {
    return baseBungieUrl + (emblem?.secondarySpecial || defaultBannerEmblem)
}

export function bungieClanBannerBannerLayerUrl(path: string | undefined) {
    return baseBungieUrl + (path || "")
}

export function bungiePgcrImageUrl(path: string | undefined) {
    return baseBungieUrl + (path || defaultPgcrImage)
}
