import styles from "../../../styles/pages/profile/profile.module.css"
import { ClanBannerData } from "../../../util/destiny/clanBanner"

type ClanBannerProps = ClanBannerData

const ClanBanner = ({
    gonfalcons,
    gonfalconsColor,
    decalTop,
    decalTopColor,
    decalSecondary,
    decalSecondaryColor,
    decalPrimary,
    decalPrimaryColor
}: ClanBannerProps) => {
    const decalYPos = "25%"
    const decalHeight = "70%"
    const topDecalY = "2%"
    const decalTopHeight = "50%"
    return (
        <svg className={styles["clan-img"]}>
            <defs>
                {gonfalcons && (
                    <mask id="gonfalcons">
                        <image
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            xlinkHref={gonfalcons ? `https://bungie.net${gonfalcons}` : ""}
                        />
                    </mask>
                )}
                <mask id="topDecal">
                    <image
                        x="0"
                        y={topDecalY}
                        width="100%"
                        height={decalTopHeight}
                        xlinkHref={decalTop ? `https://bungie.net${decalTop}` : ""}
                        mask="url(#gonfalcons)"
                    />
                </mask>
                <mask id="decal2">
                    <image
                        x="0"
                        y={decalYPos}
                        width="100%"
                        height={decalHeight}
                        xlinkHref={decalSecondary ? `https://bungie.net${decalSecondary}` : ""}
                        mask="url(#gonfalcons)"
                    />
                </mask>
                <mask id="decal">
                    <image
                        x="0"
                        y={decalYPos}
                        width="100%"
                        height={decalHeight}
                        xlinkHref={decalPrimary ? `https://bungie.net${decalPrimary}` : ""}
                        mask="url(#gonfalcons)"
                    />
                </mask>
            </defs>
            <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={gonfalconsColor}
                mask="url(#gonfalcons)"
            />
            <rect
                x="0"
                y={topDecalY}
                width="100%"
                height={decalTopHeight}
                fill={decalTopColor}
                mask="url(#topDecal)"
            />
            <rect
                x="0"
                y={decalYPos}
                width="100%"
                height={decalHeight}
                fill={decalSecondaryColor}
                mask="url(#decal2)"
            />
            <rect
                x="0"
                y={decalYPos}
                width="100%"
                height={decalHeight}
                fill={decalPrimaryColor}
                mask="url(#decal)"
            />
        </svg>
    )
}

export default ClanBanner
