import styles from "../../styles/profile.module.css"
import { useBungieNextMembership } from "../../hooks/bungieNextMembership"
import { ErrorHandler, ProfileComponent } from "../../util/types"
import Head from "next/head"
import UserCard from "./UserCard"
import RankingBanner from "./RankingBanner"
import { Founders } from "../../util/special"
import ClanCard from "./ClanCard"
import PinnedActivity from "./PinnedActivity"
import RaidCards, { Layout } from "./RaidCards"
import ToggleSwitch from "./ToggleSwitch"
import { useState } from "react"
import { Icons } from "../../util/icons"
import { useProfileStats } from "../../hooks/profileStats"
import { useCharacterStats } from "../../hooks/characterStats"
import { useRaidHubProfile } from "../../hooks/raidhubProfile"

type ProfileProps = ProfileComponent & {
    errorHandler: ErrorHandler
}

const Profile = ({ userInfo, emblemBackgroundPath, errorHandler }: ProfileProps) => {
    const { profile, isLoading: isLoadingProfile } = useRaidHubProfile(userInfo.membershipId)
    const { membership } = useBungieNextMembership({ ...userInfo, errorHandler })
    const [showDiv, setShowDiv] = useState(false);
    const {
        stats: profileStats,
        isLoading: isLoadingProfileStats,
        characterIds
    } = useProfileStats({ ...userInfo, errorHandler })
    const { stats: raidMetrics, isLoading: isLoadingRaidMetrics } = useCharacterStats({
        ...userInfo,
        characterIds,
        errorHandler
    })
    const [layout, setLayout] = useState<Layout>(Layout.DotCharts)

    const handleToggle = (buttonState: boolean) => {
        const newState = buttonState ? Layout.RecentActivities : Layout.DotCharts
        setLayout(newState)
    }

    const name = userInfo.bungieGlobalDisplayName ?? userInfo.displayName

    return (
        <main className={styles["main"]}>
            <Head>
                <title>{`${name} | RaidHub`}</title>
            </Head>
            <section className={styles["user-info"]}>
                <UserCard
                    userInfo={{ ...membership, ...userInfo }}
                    socials={profile?.socials}
                    userIcon={profile?.profilePicture ?? ("https://bungie.net" + (userInfo.iconPath ?? "/img/profile/avatars/default_avatar.gif"))}
                    emblemBackgroundPath={profile?.bannerPicture ?? "https://bungie.net" + emblemBackgroundPath}
                    backgroundImage={profile?.background?.replace(/;$/, "") ?? ""}
                />

                <div className={styles["ranking-banners"]}>
                    <RankingBanner icon={Icons.SKULL} backgroundColor={"#fa6b6bA9"}>
                        <span>Clears Rank</span>
                        <span className={styles["banner-bold"]}>Challenger #1</span>
                        <span>9999</span>
                    </RankingBanner>

                    <RankingBanner icon={Icons.SPEED} backgroundColor={"#fa6b6bA9"}>
                        <span>Speed Rank</span>
                        <span className={styles["banner-bold"]}>Challenger #1</span>
                        <span>9hr 99m 99s</span>
                    </RankingBanner>

                    <RankingBanner icon={Icons.DIAMOND} backgroundColor={"#4ea2ccA9"}>
                        <span>Low-Mans</span>
                        <span className={styles["banner-bold"]}>Diamond IV</span>
                        <span>69</span>
                    </RankingBanner>

                    {Object.keys(Founders).includes(userInfo.membershipId) && (
                        <div className={styles["ranking-banner"]}>
                            <img src="/logo.png" alt="" />

                            <div className={styles["banners-text"]}>
                                <span className={styles["banner-bold"]}>RaidHub Founder</span>
                                <span className={styles["banner-subtext"]}>
                                    This user contributed to creating RaidHub
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <ClanCard {...userInfo} errorHandler={errorHandler} />
            </section>
            <section className={styles["content"]}>
                <div className={styles["mid"]}>
                    <PinnedActivity
                        activityId={profile?.pinnedActivity}
                        errorHandler={errorHandler}
                    />
                    <div className={styles["layout-toggle"]}>
                        <span className={styles["description-toggle"]}>Raids</span>
                        <ToggleSwitch defaultState={!!layout} onToggle={handleToggle} />
                        <span className={styles["description-toggle"]}>History</span>
                    </div>
                </div>
                <RaidCards
                    {...userInfo}
                    profile={profile}
                    characterIds={characterIds}
                    layout={layout}
                    raidMetrics={raidMetrics}
                    isLoadingRaidMetrics={isLoadingRaidMetrics}
                    errorHandler={errorHandler}
                />
            </section>
        </main>
    )
}

export default Profile
