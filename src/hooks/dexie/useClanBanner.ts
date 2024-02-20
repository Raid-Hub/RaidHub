import type { ClanBanner } from "bungie-net-core/models"
import { useLiveQuery } from "dexie-react-hooks"
import type { ClanBannerData } from "~/types/profile"
import type { RGBA } from "~/util/destiny/manifest"
import { indexDB } from "~/util/dexie"

export function useClanBanner(banner: ClanBanner): ClanBannerData {
    const decalPrimaryColor = useLiveQuery(
        () => indexDB.clanBannerDecalPrimaryColors.get({ hash: banner.decalColorId }),
        [banner.decalColorId]
    )
    const decalSecondaryColor = useLiveQuery(
        () => indexDB.clanBannerDecalSecondaryColors.get({ hash: banner.decalBackgroundColorId }),
        [banner.decalBackgroundColorId]
    )
    const decalPath = useLiveQuery(
        () => indexDB.clanBannerDecals.get({ hash: banner.decalId }),
        [banner.decalId]
    )
    const gonfalconsPath = useLiveQuery(
        () => indexDB.clanBannerGonfalons.get({ hash: banner.gonfalonId }),
        [banner.gonfalonId]
    )
    const gonfalconsColor = useLiveQuery(
        () => indexDB.clanBannerGonfalons.get({ hash: banner.gonfalonColorId }),
        [banner.gonfalonColorId]
    )
    const decalTopColor = useLiveQuery(
        () => indexDB.clanBannerGonfalonDetailColors.get({ hash: banner.gonfalonDetailColorId }),
        [banner.gonfalonDetailColorId]
    )
    const decalTopPath = useLiveQuery(
        () => indexDB.clanBannerGonfalonDetailColors.get({ hash: banner.gonfalonDetailId }),
        [banner.gonfalonDetailId]
    )

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
            path: RGBAToHex(decalTopPath),
            color: RGBAToHex(decalTopColor)
        },
        gonfalcons: {
            path: gonfalconsPath?.value ?? "",
            color: gonfalconsColor?.value ?? ""
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

    return `#${hex.red}${hex.green}${hex.blue}${hex.alpha}`
}
