import { ClanBannerData, RGBA } from "../../util/types"
import styles from "../../styles/profile.module.css"

type ClanBannerProps = {
    data: ClanBannerData
}
const ClanBanner = ({ data }: ClanBannerProps) => {
    const decalYPos = "25%"
    const decalHeight = "70%"
    const topDecalY = "2%"
    const decalTopHeight = "50%"
    return (
        <svg className={styles["clan-img"]}>
            <defs>
                <mask id="gonfalcons">
                    <image
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        xlinkHref={`https://bungie.net${data.gonfalcons}`}
                    />
                </mask>
                <mask id="topDecal">
                    <image
                        x="0"
                        y={topDecalY}
                        width="100%"
                        height={decalTopHeight}
                        xlinkHref={`https://bungie.net${data.decalTop}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
                <mask id="decal2">
                    <image
                        x="0"
                        y={decalYPos}
                        width="100%"
                        height={decalHeight}
                        xlinkHref={`https://bungie.net${data.decalSecondary}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
                <mask id="decal">
                    <image
                        x="0"
                        y={decalYPos}
                        width="100%"
                        height={decalHeight}
                        xlinkHref={`https://bungie.net${data.decalPrimary}`}
                        mask="url(#gonfalcons)"
                    />
                </mask>
            </defs>
            <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={data.gonfalconsColor}
                mask="url(#gonfalcons)"
            />
            <rect
                x="0"
                y={topDecalY}
                width="100%"
                height={decalTopHeight}
                fill={data.decalTopColor}
                mask="url(#topDecal)"
            />
            <rect
                x="0"
                y={decalYPos}
                width="100%"
                height={decalHeight}
                fill={data.decalSecondaryColor}
                mask="url(#decal2)"
            />
            <rect
                x="0"
                y={decalYPos}
                width="100%"
                height={decalHeight}
                fill={data.decalPrimaryColor}
                mask="url(#decal)"
            />
        </svg>
    )
}

export default ClanBanner
