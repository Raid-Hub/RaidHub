import { ClanBannerData } from "~/util/destiny/clanBanner"

type ClanBannerProps = ClanBannerData & { sx: number }

const ClanBanner = ({
    gonfalcons,
    decalTop,
    decalSecondary,
    decalPrimary,
    sx
}: ClanBannerProps) => {
    return (
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
                        xlinkHref={`https://bungie.net${gonfalcons.path}`}
                    />
                </mask>
                <mask id="topDecal">
                    <image
                        width="100%"
                        height="100%"
                        xlinkHref={`https://bungie.net${decalTop.path}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
                <mask id="decal2">
                    <image
                        width="100%"
                        height="100%"
                        xlinkHref={`https://bungie.net${decalSecondary.path}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
                <mask id="decal">
                    <image
                        width="100%"
                        height="100%"
                        xlinkHref={`https://bungie.net${decalPrimary.path}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
            </defs>
            <g cx="50%" cy="50%">
                <rect width="100%" height="100%" fill={gonfalcons.color} mask="url(#gonfalcons)" />
                <rect width="100%" height="100%" fill={decalTop.color} mask="url(#topDecal)" />
                <rect width="100%" height="100%" fill={decalSecondary.color} mask="url(#decal2)" />
                <rect width="100%" height="100%" fill={decalPrimary.color} mask="url(#decal)" />
            </g>
        </svg>
    )
}

export default ClanBanner
