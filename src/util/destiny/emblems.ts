import { CachedEmblem } from "./manifest"

const defaultBannerEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"

export function bannerEmblemFromCache(emblem: CachedEmblem | null) {
    // the www here is very important...please do not remove it
    return "https://www.bungie.net" + (emblem?.banner ?? defaultBannerEmblem)
}
