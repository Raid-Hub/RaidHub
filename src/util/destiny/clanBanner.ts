import { ClanBanner } from "bungie-net-core/lib/models"
import { RGBA } from "./manifest"
import { indexDB } from "../../util/dexie"

export type ClanBannerData = {
    decalPrimary: string
    decalPrimaryColor: string
    decalSecondary: string
    decalSecondaryColor: string
    gonfalcons: string
    gonfalconsColor: string
    decalTop: string
    decalTopColor: string
}

export async function resolveClanBanner(banner: ClanBanner): Promise<ClanBannerData> {
    const [
        decalPrimaryColor,
        decalSecondaryColor,
        { foregroundPath: decalPrimary, backgroundPath: decalSecondary },
        gonfalcons,
        gonfalconsColor,
        decalTopColor,
        decalTop
    ] = await Promise.all([
        indexDB.clanBannerDecalPrimaryColors.get({ hash: banner.decalColorId }).then(RGBAToHex),
        indexDB.clanBannerDecalSecondaryColors
            .get({ hash: banner.decalBackgroundColorId })
            .then(RGBAToHex),
        indexDB.clanBannerDecalsSquare
            .get({ hash: banner.decalId })
            .then(d => d ?? { foregroundPath: "", backgroundPath: "" }),

        indexDB.clanBannerGonfalons.get({ hash: banner.gonfalonId }).then(d => d?.value ?? ""),
        indexDB.clanBannerGonfalonColors.get({ hash: banner.gonfalonColorId }).then(RGBAToHex),
        indexDB.clanBannerGonfalonDetailColors
            .get({ hash: banner.gonfalonDetailColorId })
            .then(RGBAToHex),
        indexDB.clanBannerGonfalonDetailsSquare
            .get({ hash: banner.gonfalonDetailId })
            .then(d => d?.value ?? "")
    ] as const)

    return {
        decalPrimaryColor,
        decalSecondaryColor,
        decalPrimary,
        decalSecondary,
        gonfalcons,
        gonfalconsColor,
        decalTopColor,
        decalTop
    }
}

/**
 * Useful for clan banners since bungie gives us the RGBA values as their own properties
 * @param rgba a list of the rgba values
 * @returns a hex string with #
 */
function RGBAToHex(rgba: RGBA | undefined): string {
    if (!rgba) return `#00000000`
    const hex = Object.fromEntries(
        Object.entries(rgba).map(([channel, value]) => {
            const str = value.toString(16)
            return [channel, str.length === 1 ? `0${str}` : str]
        })
    )

    return `#${hex["red"]}${hex["green"]}${hex["blue"]}${hex["alpha"]}`
}
