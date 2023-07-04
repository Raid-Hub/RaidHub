import BannersJson from "../../util/destiny-definitions/clanBanner.json" assert { type: "json" }
import { ClanBanner } from "bungie-net-core/lib/models"

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
type RGBA = {
    blue: number
    green: number
    red: number
    alpha: number
}
type RawClanBannerData = {
    clanBannerDecals: {
        [hash: string]: {
            foregroundPath: string
            backgroundPath: string
        }
    }
    clanBannerDecalPrimaryColors: { [hash: string]: RGBA }
    clanBannerDecalSecondaryColors: { [hash: string]: RGBA }
    clanBannerGonfalons: { [hash: string]: string }
    clanBannerGonfalonColors: { [hash: string]: RGBA }
    clanBannerGonfalonDetails: { [hash: string]: string }
    clanBannerGonfalonDetailColors: { [hash: string]: RGBA }
    clanBannerDecalsSquare: {
        [hash: string]: {
            foregroundPath: string
            backgroundPath: string
        }
    }
    clanBannerGonfalonDetailsSquare: { [hash: string]: string }
}
const clanBanners: RawClanBannerData = BannersJson

export function resolveClanBanner(clanBanner: ClanBanner): ClanBannerData {
    return {
        decalPrimaryColor: RGBAToHex(
            clanBanners.clanBannerDecalPrimaryColors[clanBanner.decalColorId]
        ),
        decalSecondaryColor: RGBAToHex(
            clanBanners.clanBannerDecalSecondaryColors[clanBanner.decalBackgroundColorId]
        ),
        decalPrimary: clanBanners.clanBannerDecalsSquare[clanBanner.decalId].foregroundPath,
        decalSecondary: clanBanners.clanBannerDecalsSquare[clanBanner.decalId].backgroundPath,
        gonfalcons: clanBanners.clanBannerGonfalons[clanBanner.gonfalonId],
        gonfalconsColor: RGBAToHex(
            clanBanners.clanBannerGonfalonColors[clanBanner.gonfalonColorId]
        ),
        decalTopColor: RGBAToHex(
            clanBanners.clanBannerGonfalonDetailColors[clanBanner.gonfalonDetailColorId]
        ),
        decalTop: clanBanners.clanBannerGonfalonDetailsSquare[clanBanner.gonfalonDetailId]
    }
}

/**
 * Useful for clan banners since bungie gives us the RGBA values as their own properties
 * @param rgba a list of the rgba values
 * @returns a hex string with #
 */
function RGBAToHex(rgba: RGBA): string {
    const hex = Object.fromEntries(
        Object.entries(rgba).map(([channel, value]) => {
            const str = value.toString(16)
            return [channel, str.length === 1 ? `0${str}` : str]
        })
    )

    return `#${hex["red"]}${hex["green"]}${hex["blue"]}${hex["alpha"]}`
}
