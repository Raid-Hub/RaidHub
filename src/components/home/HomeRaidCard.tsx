import React from "react"
import styles from "../../styles/home.module.css"
import { Raid, RaidCardBackground } from "../../util/raid"
import { LocalizedStrings } from "../../util/localized-strings"
import { useLanguage } from "../../hooks/language"

type HomeRaidCardProps = {
    raid: Raid
}

const HomeRaidCard = ({ raid }: HomeRaidCardProps) => {
    const { language } = useLanguage()
    const strings = LocalizedStrings[language]
    return (
        <div className={styles["home-raid-card"]}>
            <div className={styles["card-image-header"]}>
                <img src={RaidCardBackground[raid]} alt={`header for ${strings.raidNames[raid]}`} />
                <h3>{strings.raidNames[raid]}</h3>
            </div>
            <div className={styles["card-content"]}>
                <div className={styles["content-section"]}>
                    <h4>World's First Leaderboards</h4>
                    <p>Coming soon...</p>
                </div>
                <div className={styles["content-section"]}>
                    <h4>Speedrun Leaderboards</h4>
                    <p>Coming soon...</p>
                </div>
                <div className={styles["content-section"]}>
                    <h4>Clears Leaderboards</h4>
                    <p>Coming soon...</p>
                </div>
            </div>
        </div>
    )
}

export default HomeRaidCard
