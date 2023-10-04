import { clanBannerBannerLayerUrl } from "~/util/destiny/bungie-icons"
import { useClanBanner } from "../app/DestinyManifestManager"
import { ClanBanner } from "bungie-net-core/models"

const mast =
    "https://imagedelivery.net/85AvSk7Z9-QdHfmk4t5dsw/3be0c292-1e86-4206-189a-ab6cd337d900/medium"

type ClanBannerProps = { data: ClanBanner; sx: number }

const ClanBanner = ({ data, sx }: ClanBannerProps) => {
    const { data: queryData } = useClanBanner(data)

    const bannerWidth = `${9 * sx}px`
    const bannerHeight = `${16 * sx}px`
    const mastHeight = `${18 * sx}px`

    return queryData ? (
        <svg
            key={"banner"}
            style={{ width: bannerWidth, height: mastHeight }}
            xmlns="http://www.w3.org/2000/svg"
            width={bannerWidth}
            height={mastHeight}>
            <image xlinkHref={mast} width="100%" height="100%" />
            <g>
                <defs>
                    <mask id="gonfalcons">
                        <image
                            width={bannerWidth}
                            height={bannerHeight}
                            xlinkHref={clanBannerBannerLayerUrl(queryData.gonfalcons.path)}
                        />
                    </mask>
                    <mask id="topDecal">
                        <image
                            width={bannerWidth}
                            height={bannerHeight}
                            xlinkHref={clanBannerBannerLayerUrl(queryData.decalTop.path)}
                            mask="url(#gonfalcons)"
                        />
                    </mask>
                    <mask id="decal2">
                        <image
                            width={bannerWidth}
                            height={bannerHeight}
                            xlinkHref={clanBannerBannerLayerUrl(queryData.decalSecondary.path)}
                            mask="url(#gonfalcons)"
                        />
                    </mask>
                    <mask id="decal">
                        <image
                            width={bannerWidth}
                            height={bannerHeight}
                            xlinkHref={clanBannerBannerLayerUrl(queryData.decalPrimary.path)}
                            mask="url(#gonfalcons)"
                        />
                    </mask>
                </defs>
                <rect
                    width={bannerWidth}
                    height={bannerHeight}
                    fill={queryData.gonfalcons.color}
                    mask="url(#gonfalcons)"
                />
                <rect
                    width={bannerWidth}
                    height={bannerHeight}
                    fill={queryData.decalTop.color}
                    mask="url(#topDecal)"
                />
                <rect
                    width={bannerWidth}
                    height={bannerHeight}
                    fill={queryData.decalSecondary.color}
                    mask="url(#decal2)"
                />
                <rect
                    width={bannerWidth}
                    height={bannerHeight}
                    fill={queryData.decalPrimary.color}
                    mask="url(#decal)"
                />
            </g>
        </svg>
    ) : null
}

export default ClanBanner
