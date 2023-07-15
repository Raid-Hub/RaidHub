import styles from "../../../styles/pages/profile/banners.module.css"
import { RankingBannerData, RankingBannerType } from "../../../types/profile"
import { RaidReportBannerTier } from "../../../types/raidreport"
import { formattedNumber, secondsToHMS } from "../../../util/presentation/formatting"
import { Founders } from "../../../util/raidhub/special"
import { useLocale } from "../../app/LanguageProvider"
import Loading from "../../global/Loading"
import RankingBanner from "./RankingBanner"
import Logo from "../../../../public/logo.png"
import Image, { StaticImageData } from "next/image"
import { Eager, Skull } from "../../../images/icons"

type BannerProps = {
    banners: RankingBannerData[] | null
    destinyMembershipId: string
    isLoading: boolean
}
const Banners = ({ destinyMembershipId, isLoading, banners }: BannerProps) => {
    const { strings, locale } = useLocale()

    return isLoading ? (
        <Loading wrapperClass={styles["ranking-banners-loading"]} />
    ) : (
        banners && (
            <div className={styles["ranking-banners"]}>
                {banners.map((banner, key) => (
                    <RankingBanner
                        key={key}
                        icon={BannerIcons[banner.type]}
                        backgroundColor={BannerColors[banner.tier]}>
                        <h3>{strings.bannerTitles[banner.type]}</h3>
                        <p>{`${banner.tier} ${
                            typeof banner.secondary === "number"
                                ? `#${banner.secondary}`
                                : banner.secondary
                        }`}</p>
                        <p className={styles["banner-bold"]}>
                            {banner.type === RankingBannerType.Speed
                                ? secondsToHMS(banner.value)
                                : formattedNumber(banner.value, locale)}
                        </p>
                    </RankingBanner>
                ))}
                {Object.keys(Founders).includes(destinyMembershipId) && (
                    <div className={styles["ranking-banner"]}>
                        <Image className={styles["ranking-banner-icon"]} src={Logo} alt="" />

                        <div className={styles["banner-text"]}>
                            <p className={styles["banner-bold"]}>RaidHub Founder</p>
                            <p className={styles["banner-subtext"]}>
                                This user contributed to creating RaidHub
                            </p>
                        </div>
                    </div>
                )}
            </div>
        )
    )
}

export default Banners

const BannerColors: { [key in RaidReportBannerTier]: string } = {
    [RaidReportBannerTier.Bronze]: "#4e191978",
    [RaidReportBannerTier.Silver]: "#b3b3b399",
    [RaidReportBannerTier.Gold]: "#f1c05386",
    [RaidReportBannerTier.Platinum]: "#b4cadf99",
    [RaidReportBannerTier.Diamond]: "#4fa7d699",
    [RaidReportBannerTier.Master]: "#c187f599",
    [RaidReportBannerTier.Challenger]: "#ff63c999"
}

const BannerIcons: { [key in RankingBannerType]: StaticImageData } = {
    [RankingBannerType.Speed]: Eager,
    [RankingBannerType.FullClears]: Skull
}
