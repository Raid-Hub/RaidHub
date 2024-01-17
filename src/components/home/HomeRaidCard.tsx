import Link from "next/link"
import styles from "~/styles/pages/home.module.css"
import RightArrow from "~/images/icons/RightArrow"
import RaidCardBackground from "~/images/raid-backgrounds"
import { Difficulty, ListedRaid } from "~/types/raids"
import { LocalStrings } from "~/util/presentation/localized-strings"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { SpeedData, SpeedrunVariables } from "~/data/speedrun-com-mappings"
import CloudflareImage from "~/images/CloudflareImage"
import { RaidHubManifest } from "~/types/raidhub-api"

type HomeRaidCardProps = {
    raid: ListedRaid
    strings: LocalStrings
    worldFirstLeaderboards: RaidHubManifest["leaderboards"]["worldFirst"][ListedRaid]
    individualLeaderboards: RaidHubManifest["leaderboards"]["individual"][ListedRaid] | null
}

const HomeRaidCard = ({
    raid,
    strings,
    worldFirstLeaderboards,
    individualLeaderboards
}: HomeRaidCardProps) => {
    return (
        <div id={RaidToUrlPaths[raid]} className={styles["home-raid-card"]}>
            <div className={styles["card-image-header"]}>
                <CloudflareImage
                    priority
                    width={640}
                    height={360}
                    cloudflareId={RaidCardBackground[raid]}
                    alt={`header for ${strings.raidNames[raid]}`}
                />
                <h2 className={styles["card-title"]}>{strings.raidNames[raid]}</h2>
            </div>
            <div className={styles["card-content"]}>
                {!!worldFirstLeaderboards.length && (
                    <div className={`${styles["card-section"]} ${styles["card-section-top"]}`}>
                        <div className={styles["section-title"]}>
                            <span>{strings.worldFirstLeaderboards}</span>
                        </div>
                        <div className={styles["content-section-inner"]}>
                            <Link
                                href={`/leaderboards/${RaidToUrlPaths[raid]}/worldfirst`}
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
                                    href={`/leaderboards/${RaidToUrlPaths[raid]}/first/normal`}
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
                                    href={`/leaderboards/${RaidToUrlPaths[raid]}/${category}`}
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
                        <span>{strings.rtaSpeedrunLeaderboards}</span>
                    </div>
                    <div className={styles["content-section-inner"]}>
                        {SpeedrunVariables[raid] ? (
                            Object.entries(SpeedrunVariables[raid]!.values).map(
                                ([type, { id, name: key }]: [string, SpeedData]) => (
                                    <Link
                                        href={`/leaderboards/${
                                            RaidToUrlPaths[raid]
                                        }/src/${encodeURIComponent(type)}`}
                                        className={styles["content-section"]}
                                        key={id}>
                                        <div>
                                            <h4>{strings.leaderboards[key]}</h4>
                                        </div>
                                        <div className={styles["content-section-arrow"]}>
                                            <RightArrow />
                                        </div>
                                    </Link>
                                )
                            )
                        ) : (
                            <Link
                                href={`/leaderboards/${RaidToUrlPaths[raid]}/src`}
                                className={styles["content-section"]}>
                                <div>
                                    <h4>{strings.leaderboards.anyPercent}</h4>
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
                            <span>{strings.otherLeaderboards}</span>
                        </div>
                        <div className={styles["content-section-inner"]}>
                            {worldFirstLeaderboards.find(b => b.type === "master") && (
                                <Link
                                    href={`/leaderboards/${RaidToUrlPaths[raid]}/first/master`}
                                    className={styles["content-section"]}>
                                    <div>
                                        <h4>{strings.difficulty[Difficulty.MASTER]}</h4>
                                    </div>
                                    <div className={styles["content-section-arrow"]}>
                                        <RightArrow />
                                    </div>
                                </Link>
                            )}
                            {worldFirstLeaderboards.find(b => b.type === "prestige") && (
                                <Link
                                    href={`/leaderboards/${RaidToUrlPaths[raid]}/first/prestige`}
                                    className={styles["content-section"]}>
                                    <div>
                                        <h4>{strings.difficulty[Difficulty.PRESTIGE]}</h4>
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
