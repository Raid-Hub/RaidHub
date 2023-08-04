import styles from "../../styles/pages/home.module.css"
import { AvailableRaid } from "../../types/raids"
import { LocalStrings } from "../../util/presentation/localized-strings"
import Image from "next/image"
import RaidCardBackground from "../../images/raid-backgrounds"

type HomeRaidCardProps = {
    raid: AvailableRaid
    strings: LocalStrings
}

const HomeRaidCard = ({ raid, strings }: HomeRaidCardProps) => {
    return (
        <div className={styles["home-raid-card"]}>
            <div className={styles["card-image-header"]}>
                <Image
                    priority
                    width={640}
                    height={360}
                    src={RaidCardBackground[raid]}
                    alt={`header for ${strings.raidNames[raid]}`}
                />
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
