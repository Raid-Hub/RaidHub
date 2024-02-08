import { ClanBanner } from "bungie-net-core/models"
import { clanBannerBannerLayerUrl } from "~/util/destiny/bungie-icons"
import { useClanBanner } from "../../app/managers/DestinyManifestManager"

const mast =
    "https://cdn.raidhub.io/cdn-cgi/imagedelivery/85AvSk7Z9-QdHfmk4t5dsw/3be0c292-1e86-4206-189a-ab6cd337d900/medium"

type ClanBannerProps = { data: ClanBanner; sx: number }

const ClanBanner = ({ data, sx }: ClanBannerProps) => {
    const { data: bannerData } = useClanBanner(data)

    const mastWidthRaw = 9.4 * sx
    const mastWidth = `${mastWidthRaw}px`
    const mastHeight = `${mastWidthRaw * (768 / 368)}px`

    const bannerWidthRaw = 9 * sx
    const bannerWidth = `${bannerWidthRaw}px`
    const bannerHeight = `${bannerWidthRaw * (16 / 9)}px`

    const bannerOffset = `${-0.41 * sx}px`
    const bannerCentering = `translate(${(mastWidthRaw - bannerWidthRaw) / 2})`

    return bannerData ? (
        <svg
            key={"banner"}
            style={{ width: mastWidth, height: mastHeight }}
            xmlns="http://www.w3.org/2000/svg">
            <g transform={bannerCentering}>
                <defs>
                    <mask id="gonfalcons">
                        <image
                            y={bannerOffset}
                            width={bannerWidth}
                            height={bannerHeight}
                            xlinkHref={clanBannerBannerLayerUrl(bannerData.gonfalcons.path)}
                        />
                    </mask>
                    <mask id="topDecal">
                        <image
                            y={bannerOffset}
                            width={bannerWidth}
                            height={bannerHeight}
                            xlinkHref={clanBannerBannerLayerUrl(bannerData.decalTop.path)}
                            mask="url(#gonfalcons)"
                        />
                    </mask>
                    <mask id="decal2">
                        <image
                            y={bannerOffset}
                            width={bannerWidth}
                            height={bannerHeight}
                            xlinkHref={clanBannerBannerLayerUrl(bannerData.decalSecondary.path)}
                            mask="url(#gonfalcons)"
                        />
                    </mask>
                    <mask id="decal">
                        <image
                            y={bannerOffset}
                            width={bannerWidth}
                            height={bannerHeight}
                            xlinkHref={clanBannerBannerLayerUrl(bannerData.decalPrimary.path)}
                            mask="url(#gonfalcons)"
                        />
                    </mask>
                </defs>
                <rect
                    y={bannerOffset}
                    width={bannerWidth}
                    height={bannerHeight}
                    fill={bannerData.gonfalcons.color}
                    mask="url(#gonfalcons)"
                />
                <rect
                    y={bannerOffset}
                    width={bannerWidth}
                    height={bannerHeight}
                    fill={bannerData.decalTop.color}
                    mask="url(#topDecal)"
                />
                <rect
                    y={bannerOffset}
                    width={bannerWidth}
                    height={bannerHeight}
                    fill={bannerData.decalSecondary.color}
                    mask="url(#decal2)"
                />
                <rect
                    y={bannerOffset}
                    width={bannerWidth}
                    height={bannerHeight}
                    fill={bannerData.decalPrimary.color}
                    mask="url(#decal)"
                />
            </g>
            <image xlinkHref={mast} width="100%" height="100%" />
        </svg>
    ) : null
}

export default ClanBanner
