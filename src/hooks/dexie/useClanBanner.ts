import type { ClanBanner } from "bungie-net-core/models"
import type { RGBA } from "~/app/layout/managers/DestinyManifestManager"
import { useDexieGetQuery } from "~/util/dexie"
import { o } from "~/util/o"

export function useClanBanner(banner: ClanBanner) {
    const decalPath = useDexieGetQuery("clanBannerDecals", banner.decalId)

    const decalPrimaryColor = useDexieGetQuery("clanBannerDecalPrimaryColors", banner.decalColorId)
    const decalSecondaryColor = useDexieGetQuery(
        "clanBannerDecalSecondaryColors",
        banner.decalBackgroundColorId
    )

    const gonfalconsPath = useDexieGetQuery("clanBannerGonfalons", banner.gonfalonId)
    const gonfalconsColor = useDexieGetQuery("clanBannerGonfalonColors", banner.gonfalonColorId)

    const decalTopColor = useDexieGetQuery(
        "clanBannerGonfalonDetailColors",
        banner.gonfalonDetailColorId
    )
    const decalTopPath = useDexieGetQuery("clanBannerGonfalonDetails", banner.gonfalonDetailId)

    return {
        decalPrimary: {
            path: decalPath?.foregroundPath ?? "",
            color: RGBAToHex(decalPrimaryColor)
        },
        decalSecondary: {
            path: decalPath?.backgroundPath ?? "",
            color: RGBAToHex(decalSecondaryColor)
        },
        decalTop: {
            path: decalTopPath?.value ?? "",
            color: RGBAToHex(decalTopColor)
        },
        gonfalcons: {
            path: gonfalconsPath?.value ?? "",
            color: RGBAToHex(gonfalconsColor)
        }
    }
}

/**
 * Useful for clan banners since bungie gives us the RGBA values as their own properties
 * @param rgba a list of the rgba values
 * @returns a hex string with #
 */
function RGBAToHex(rgba: RGBA | null): string {
    if (!rgba) return "#00000000"

    const hex = o.fromEntries(
        o.map(rgba, (channel, value) => [channel, value.toString(16).padStart(2, "0")])
    )

    return `#${hex.red}${hex.green}${hex.blue}${hex.alpha}`
}
