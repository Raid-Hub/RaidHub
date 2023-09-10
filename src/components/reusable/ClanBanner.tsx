import { useClanBanner } from "../app/DestinyManifestManager"
import { ClanBanner } from "bungie-net-core/models"

type ClanBannerProps = { data: ClanBanner; sx: number }

const ClanBanner = ({ data, sx }: ClanBannerProps) => {
    const { data: queryData } = useClanBanner(data)

    return queryData ? (
        <svg
            style={{ width: `${9 * sx}px`, height: `${16 * sx}px` }}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%">
            <defs>
                <mask id="gonfalcons">
                    <image
                        width="100%"
                        height="100%"
                        xlinkHref={`https://bungie.net${queryData.gonfalcons.path}`}
                    />
                </mask>
                <mask id="topDecal">
                    <image
                        width="100%"
                        height="100%"
                        xlinkHref={`https://bungie.net${queryData.decalTop.path}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
                <mask id="decal2">
                    <image
                        width="100%"
                        height="100%"
                        xlinkHref={`https://bungie.net${queryData.decalSecondary.path}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
                <mask id="decal">
                    <image
                        width="100%"
                        height="100%"
                        xlinkHref={`https://bungie.net${queryData.decalPrimary.path}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
            </defs>
            <g cx="50%" cy="50%">
                <rect
                    width="100%"
                    height="100%"
                    fill={queryData.gonfalcons.color}
                    mask="url(#gonfalcons)"
                />
                <rect
                    width="100%"
                    height="100%"
                    fill={queryData.decalTop.color}
                    mask="url(#topDecal)"
                />
                <rect
                    width="100%"
                    height="100%"
                    fill={queryData.decalSecondary.color}
                    mask="url(#decal2)"
                />
                <rect
                    width="100%"
                    height="100%"
                    fill={queryData.decalPrimary.color}
                    mask="url(#decal)"
                />
            </g>
        </svg>
    ) : null
}

export default ClanBanner
