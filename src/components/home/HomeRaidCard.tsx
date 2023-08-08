import styles from "../../styles/pages/home.module.css"
import { AvailableRaid, RaidToUrlPaths } from "../../types/raids"
import { LocalStrings } from "../../util/presentation/localized-strings"
import Image from "next/image"
import RaidCardBackground from "../../images/raid-backgrounds"
import Link from "next/link"
import { SpeedrunVariableValues } from "../../util/speedrun-com/speedrun-ids"

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
                    <Link href={`/leaderboards/${RaidToUrlPaths[raid]}/worldfirst`}>
                        <h4>{strings.worldFirstLeaderboards}</h4>
                    </Link>
                </div>

                <div className={styles["content-section"]}>
                    <h4>{strings.rtaSpeedrunLeaderboards}</h4>
                    <ul>
                        {Object.keys(SpeedrunVariableValues[raid]).length ? (
                            Object.entries(SpeedrunVariableValues[raid]).map(
                                ([type, { id, name: key }]) => (
                                    <li key={id}>
                                        <Link
                                            href={`/leaderboards/${
                                                RaidToUrlPaths[raid]
                                            }/speedrun/rta/${encodeURIComponent(type)}`}>
                                            {strings.leaderboards[key]}
                                        </Link>
                                    </li>
                                )
                            )
                        ) : (
                            <li>
                                <Link href={`/leaderboards/${RaidToUrlPaths[raid]}/speedrun/rta`}>
                                    {strings.leaderboards.anyPercent}
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
                <div className={styles["content-section"]}>
                    <h4>{strings.apiSpeedrunLeaderboards}</h4>
                    <ul>
                        <li>{strings.comingSoon}</li>
                    </ul>
                </div>
                <div className={styles["content-section"]}>
                    <h4>{strings.clearsLeaderboards}</h4>
                    <ul>
                        <li>{strings.comingSoon}</li>
                    </ul>
                </div>
                <div className={styles["content-section"]}>
                    <h4>{strings.otherLeaderboards}</h4>
                    <ul>
                        <li>{strings.comingSoon}</li>
                        {/* {Object.keys(RaidHashes[raid])
                            .map(key => Number(key) as Difficulty)
                            .sort((a, b) => 32 - a - b) // gets the challenge difficulties on top
                            .map(difficulty => {
                                return (
                                    difficulty !== Difficulty.GUIDEDGAMES &&
                                    difficulty !== Difficulty.NA &&
                                    difficulty !== Difficulty.CONTEST &&
                                    difficulty !== Difficulty.NORMAL && (
                                        <li key={difficulty}>
                                            <Link
                                                href={`/leaderboards/${RaidToUrlPaths[raid]}/worldfirst/${DifficultyToUrlPaths[difficulty]}`}>
                                                {strings.difficulty[difficulty]}
                                            </Link>
                                        </li>
                                    )
                                )
                            })} */}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HomeRaidCard
