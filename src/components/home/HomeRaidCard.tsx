import React from "react"
import styles from "../../styles/home.module.css"
import { Raid, RaidCardBackground } from "../../util/destiny/raid"
import { LocalStrings } from "../../util/presentation/localized-strings"

type HomeRaidCardProps = {
    raid: Raid
    strings: LocalStrings
}

const HomeRaidCard = ({ raid, strings }: HomeRaidCardProps) => {
    return (
        <div className={styles["home-raid-card"]}>
            <div className={styles["card-image-header"]}>
                <img src={RaidCardBackground[raid]} alt={`header for ${strings.raidNames[raid]}`} />
                <h3>{strings.raidNames[raid]}</h3>
            </div>
            <div className={styles["card-content"]}>
                <div className={styles["content-section"]}>
                    <h4>{strings.worldsFirstLeaderboards}</h4>
                    <p>{strings.comingSoon}</p>
                </div>
                <div className={styles["content-section"]}>
                    <h4>{strings.speedrunLeaderboards}</h4>
                    <p>{strings.comingSoon}</p>
                </div>
                <div className={styles["content-section"]}>
                    <h4>{strings.clearsLeaderboards}</h4>
                    <p>{strings.comingSoon}</p>
                </div>
            </div>
        </div>
    )
}

export default HomeRaidCard
