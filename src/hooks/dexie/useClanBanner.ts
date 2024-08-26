import type { ClanBanner } from "bungie-net-core/models"
import { RGBAToHex } from "~/util/destiny/rgba"
import { useDexieGetQuery } from "~/util/dexie/useDexieGetQuery"

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
