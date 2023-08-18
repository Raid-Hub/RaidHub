import { ClanBanner } from "bungie-net-core/lib/models"
import { RGBA } from "./manifest"
import { indexDB } from "../dexie"

type ClanBannerDataPart = {
    path: string
    color: string
}
export type ClanBannerData = {
    decalPrimary: ClanBannerDataPart
    decalSecondary: ClanBannerDataPart
    gonfalcons: ClanBannerDataPart
    decalTop: ClanBannerDataPart
}

export async function resolveClanBanner(banner: ClanBanner): Promise<ClanBannerData> {
    const [
        decalPrimaryColor,
        decalSecondaryColor,
        { foregroundPath: decalPrimaryPath, backgroundPath: decalSecondaryPath },
        gonfalconsPath,
        gonfalconsColor,
        decalTopColor,
        decalTopPath
    ] = await Promise.all([
        indexDB.clanBannerDecalPrimaryColors.get({ hash: banner.decalColorId }).then(RGBAToHex),
        indexDB.clanBannerDecalSecondaryColors
            .get({ hash: banner.decalBackgroundColorId })
            .then(RGBAToHex),
        indexDB.clanBannerDecals
            .get({ hash: banner.decalId })
            .then(d => d ?? { foregroundPath: "", backgroundPath: "" }),

        indexDB.clanBannerGonfalons.get({ hash: banner.gonfalonId }).then(d => d?.value ?? ""),
        indexDB.clanBannerGonfalonColors.get({ hash: banner.gonfalonColorId }).then(RGBAToHex),
        indexDB.clanBannerGonfalonDetailColors
            .get({ hash: banner.gonfalonDetailColorId })
            .then(RGBAToHex),
        indexDB.clanBannerGonfalonDetails
            .get({ hash: banner.gonfalonDetailId })
            .then(d => d?.value ?? "")
    ] as const)

    return {
        decalPrimary: {
            path: decalPrimaryPath,
            color: decalPrimaryColor
        },
        decalSecondary: {
            path: decalSecondaryPath,
            color: decalSecondaryColor
        },
        decalTop: {
            path: decalTopPath,
            color: decalTopColor
        },
        gonfalcons: {
            path: gonfalconsPath,
            color: gonfalconsColor
        }
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
