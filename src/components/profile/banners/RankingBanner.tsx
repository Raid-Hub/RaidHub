import styles from "../../../styles/pages/profile/banners.module.css"
import { ReactNode } from "react"

type RankingBannerProps = {
    icon: string
    backgroundColor: string
    children: ReactNode
}
const RankingBanner = ({ icon, backgroundColor, children: spanStack }: RankingBannerProps) => {
    return (
        <div className={styles["ranking-banner"]} style={{ backgroundColor }}>
            <img className={styles["ranking-banner-icon"]} src={icon} alt="" />

            <div className={styles["banner-text"]}>{spanStack}</div>
        </div>
    )
}

export default RankingBanner
