import React, { ReactNode } from 'react';
import styles from '../../styles/profile.module.css';

type RankingBannerProps = {
    icon: string
    backgroundColor: string
    children: ReactNode
}
const RankingBanner = ({ icon, backgroundColor, children: spanStack }: RankingBannerProps) => {
    return (
        <div className={styles["ranking-banner"]} style={{ backgroundColor }}>
            <img src={icon} alt="" />

            <div className={styles["banners-text"]}>
                {spanStack}
            </div>
        </div>
    )
}

export default RankingBanner;