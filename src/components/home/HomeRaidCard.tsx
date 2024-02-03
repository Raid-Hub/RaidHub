import Link from "next/link"
import { Difficulty } from "~/data/raid"
import RaidCardBackground from "~/data/raid-backgrounds"
import { SpeedData, SpeedrunVariables } from "~/data/speedrun-com-mappings"
import { rtaLeaderboardNames } from "~/data/strings/rta-speedrun-names"
import CloudflareImage from "~/images/CloudflareImage"
import RightArrow from "~/images/icons/RightArrow"
import styles from "~/styles/pages/home.module.css"
import { ListedRaid, RaidHubManifestResponse } from "~/types/raidhub-api"
import { useRaidHubManifest } from "../../app/managers/RaidHubManifestManager"

type HomeRaidCardProps = {
    raid: ListedRaid
    worldFirstLeaderboards: RaidHubManifestResponse["leaderboards"]["worldFirst"][ListedRaid]
    individualLeaderboards: RaidHubManifestResponse["leaderboards"]["individual"][ListedRaid]
}

const HomeRaidCard = ({
    raid,
    worldFirstLeaderboards,
    individualLeaderboards
}: HomeRaidCardProps) => {
    const { getDifficultyString, getRaidString, getUrlPathForRaid } = useRaidHubManifest()
    const raidUrlPath = getUrlPathForRaid(raid)
    return (
        <div id={raidUrlPath} className={styles["home-raid-card"]}>
            <div className={styles["card-image-header"]}>
                <CloudflareImage
                    priority
                    width={640}
                    height={360}
                    cloudflareId={RaidCardBackground[raid]}
                    alt={`header for ${getRaidString(raid)}`}
                />
                <h2 className={styles["card-title"]}>{getRaidString(raid)}</h2>
            </div>
            <div className={styles["card-content"]}>
                {!!worldFirstLeaderboards.length && (
                    <div className={`${styles["card-section"]} ${styles["card-section-top"]}`}>
                        <div className={styles["section-title"]}>
                            <span>World First Leaderboards</span>
                        </div>
                        <div className={styles["content-section-inner"]}>
                            <Link
                                href={`/leaderboards/${raidUrlPath}/worldfirst`}
                                className={styles["content-section"]}>
                                <div>
                                    <h4>
                                        {worldFirstLeaderboards.find(b => b.type === "challenge")
                                            ? "Challenge"
                                            : "Normal"}
                                    </h4>
                                </div>
                                <div className={styles["content-section-arrow"]}>
                                    <RightArrow />
                                </div>
                            </Link>
                            {worldFirstLeaderboards.find(b => b.type === "challenge") && (
                                <Link
                                    href={`/leaderboards/${raidUrlPath}/first/normal`}
                                    className={styles["content-section"]}>
                                    <div>
                                        <h4>Normal</h4>
                                    </div>
                                    <div className={styles["content-section-arrow"]}>
                                        <RightArrow />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
                {individualLeaderboards && (
                    <div className={styles["card-section"]}>
                        <div className={styles["section-title"]}>
                            <span>Individual Leaderboards</span>
                        </div>
                        <div className={styles["content-section-inner"]}>
                            {individualLeaderboards.map(({ name, category }) => (
                                <Link
                                    key={category}
                                    href={`/leaderboards/${raidUrlPath}/${category}`}
                                    className={styles["content-section"]}>
                                    <div>
                                        <h4>{name}</h4>
                                    </div>
                                    <div className={styles["content-section-arrow"]}>
                                        <RightArrow />
                                    </div>
                                    <div className={styles["content-section-inner"]}></div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                <div className={styles["card-section"]}>
                    <div className={styles["section-title"]}>
                        <span>RTA Speedrun Leaderboards</span>
                    </div>
                    <div className={styles["content-section-inner"]}>
                        {SpeedrunVariables[raid] ? (
                            Object.entries(SpeedrunVariables[raid]!.values).map(
                                ([type, { id, name: key }]: [string, SpeedData]) => (
                                    <Link
                                        href={`/leaderboards/${raidUrlPath}/src/${encodeURIComponent(
                                            type
                                        )}`}
                                        className={styles["content-section"]}
                                        key={id}>
                                        <div>
                                            <h4>{rtaLeaderboardNames[key]}</h4>
                                        </div>
                                        <div className={styles["content-section-arrow"]}>
                                            <RightArrow />
                                        </div>
                                    </Link>
                                )
                            )
                        ) : (
                            <Link
                                href={`/leaderboards/${raidUrlPath}/src`}
                                className={styles["content-section"]}>
                                <div>
                                    <h4>{rtaLeaderboardNames["anyPercent"]}</h4>
                                </div>
                                <div className={styles["content-section-arrow"]}>
                                    <RightArrow />
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {worldFirstLeaderboards.length > 1 && (
                    <div className={styles["card-section"]}>
                        <div className={styles["section-title"]}>
                            <span>Miscellaneous</span>
                        </div>
                        <div className={styles["content-section-inner"]}>
                            {worldFirstLeaderboards.find(b => b.type === "master") && (
                                <Link
                                    href={`/leaderboards/${raidUrlPath}/first/master`}
                                    className={styles["content-section"]}>
                                    <div>
                                        <h4>{getDifficultyString(Difficulty.MASTER)}</h4>
                                    </div>
                                    <div className={styles["content-section-arrow"]}>
                                        <RightArrow />
                                    </div>
                                </Link>
                            )}
                            {worldFirstLeaderboards.find(b => b.type === "prestige") && (
                                <Link
                                    href={`/leaderboards/${raidUrlPath}/first/prestige`}
                                    className={styles["content-section"]}>
                                    <div>
                                        <h4>{getDifficultyString(Difficulty.PRESTIGE)}</h4>
                                    </div>
                                    <div className={styles["content-section-arrow"]}>
                                        <RightArrow />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomeRaidCard
