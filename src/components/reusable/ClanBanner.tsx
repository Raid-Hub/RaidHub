import { clanBannerBannerLayerUrl } from "~/util/destiny/bungie-icons"
import { useClanBanner } from "../app/DestinyManifestManager"
import { ClanBanner } from "bungie-net-core/models"
import styles from "../../styles/pages/profile/clan.module.css"
import CloudflareImage from "~/images/CloudflareImage"
import ClanBannerMast from "~/images/clan-banner"

type ClanBannerProps = { data: ClanBanner; isClanPage: Boolean; sx: number }

const ClanBanner = ({ data, isClanPage, sx }: ClanBannerProps) => {
    const { data: queryData } = useClanBanner(data)

    return queryData ? (
        <>
            <CloudflareImage
                key={"bannerMast"}
                cloudflareId={ClanBannerMast}
                width={9 * sx}
                height={16 * sx}
                alt="Mast of the clan banner"
                className={styles["clan-banner-mast"]}
                style={isClanPage ? { top: `${0.466667 * sx}px`, left: 0, transform: "none" } : {}}
            />
            <svg
                key={"banner"}
                style={{ width: `${9 * sx}px`, height: `${16 * sx}px` }}
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%">
                <defs>
                    <mask id="gonfalcons">
                        <image
                            width="100%"
                            height="100%"
                            xlinkHref={clanBannerBannerLayerUrl(queryData.gonfalcons.path)}
                        />
                    </mask>
                    <mask id="topDecal">
                        <image
                            width="100%"
                            height="100%"
                            xlinkHref={clanBannerBannerLayerUrl(queryData.decalTop.path)}
                            mask="url(#gonfalcons)"
                        />
                    </mask>
                    <mask id="decal2">
                        <image
                            width="100%"
                            height="100%"
                            xlinkHref={clanBannerBannerLayerUrl(queryData.decalSecondary.path)}
                            mask="url(#gonfalcons)"
                        />
                    </mask>
                    <mask id="decal">
                        <image
                            width="100%"
                            height="100%"
                            xlinkHref={clanBannerBannerLayerUrl(queryData.decalPrimary.path)}
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
        </>
    ) : null
}

export default ClanBanner
