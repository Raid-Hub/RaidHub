import Link from "next/link"
import styles from "~/styles/pages/home.module.css"
import RightArrow from "~/images/icons/RightArrow"
import RaidCardBackground from "~/images/raid-backgrounds"
import {
    Difficulty,
    ListedRaid,
    MasterRaids,
    PrestigeRaids,
    Raid,
    RaidsWithReprisedContest
} from "~/types/raids"
import { LocalStrings } from "~/util/presentation/localized-strings"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { SpeedData, SpeedrunVariables } from "~/data/speedrun-com-mappings"
import { includedIn } from "~/util/betterIncludes"
import CloudflareImage from "~/images/CloudflareImage"

type HomeRaidCardProps = {
    raid: ListedRaid
    strings: LocalStrings
}

const HomeRaidCard = ({ raid, strings }: HomeRaidCardProps) => {
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
            </div>
            <div className={styles["card-content"]}>
                <div className={styles["section-title"]}>
                    <span>Leaderboards</span>
                </div>

                <span className={styles["card-title"]}>{strings.raidNames[raid]}</span>
                <hr />

                <div className={`${styles["card-section"]} ${styles["card-section-top"]}`}>
                    <Link
                        href={`/leaderboards/${RaidToUrlPaths[raid]}/worldfirst`}
                        className={styles["content-section"]}>
                        <div>
                            <h4>{strings.worldFirstLeaderboards}</h4>
                        </div>
                        <div className={styles["content-section-arrow"]}>
                            <RightArrow />
                        </div>
                    </Link>
                </div>

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

                {/*
                <div className={styles["content-section"]}>
                    <div className={styles["section-title"]}>
                        <span>{strings.apiSpeedrunLeaderboards}</span>
                    </div>
                    <ul>
                        <li>{strings.comingSoon}</li>
                    </ul>
                </div>

                <div className={styles["content-section"]}>
                    <div className={styles["section-title"]}>
                        <span>{strings.clearsLeaderboards}</span>
                    </div>
                    <ul>
                        <li>{strings.comingSoon}</li>
                    </ul>
                </div>
                */}

                <div className={styles["card-section"]}>
                    <div className={styles["section-title"]}>
                        <span>{strings.otherLeaderboards}</span>
                    </div>
                    {includedIn(RaidsWithReprisedContest, raid) && (
                        <Link
                            href={`/leaderboards/${RaidToUrlPaths[raid]}/first/normal`}
                            className={styles["content-section"]}>
                            <div>
                                <h4>{strings.noChallenge}</h4>
                            </div>
                            <div className={styles["content-section-arrow"]}>
                                <RightArrow />
                            </div>
                        </Link>
                    )}
                    {includedIn(MasterRaids, raid) && (
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
                    {includedIn(PrestigeRaids, raid) && (
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
                    {raid === Raid.LEVIATHAN && (
                        <Link
                            href={`/leaderboards/${RaidToUrlPaths[raid]}/first/pc`}
                            className={styles["content-section"]}>
                            <div>
                                <h4>PC</h4>
                            </div>
                            <div className={styles["content-section-arrow"]}>
                                <RightArrow />
                            </div>
                        </Link>
                    )}
                    {strings.comingSoon}
                </div>
            </div>
        </div>
    )
}

export default HomeRaidCard
