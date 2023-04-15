import styles from "../../styles/profile.module.css"
import { useBungieNextMembership } from "../../hooks/bungieNextMembership"
import { ProfileComponent } from "../../util/types"
import Head from "next/head"
import UserCard from "./UserCard"
import RankingBanner from "./RankingBanner"
import { Founders } from "../../util/special"
import ClanCard from "./ClanCard"
import PinnedActivity from "./PinnedActivity"
import RaidCards, { Layout } from "./RaidCards"
import ToggleSwitch from "../ToggleSwitch"
import { useState } from "react"
import { usePrefs } from "../../hooks/prefs"
import { DefaultPreferences, Prefs } from "../../util/preferences"
import { Icons } from "../../util/icons"

type ProfileProps = ProfileComponent

const Profile = ({ userInfo, characterIds, emblemBackgroundPath }: ProfileProps) => {
    const { membership } = useBungieNextMembership(userInfo ?? {})
    const [layout, setLayout] = useState<Layout>(Layout.DotCharts)
    const { prefs, isLoading: isLoadingPrefs } = usePrefs(userInfo.membershipId, [
        Prefs.PROFILE_BACKGROUND
    ])

    const handleToggle = (buttonState: boolean) => {
        const newState = buttonState ? Layout.RecentActivities : Layout.DotCharts
        setLayout(newState)
    }

    const name = userInfo.bungieGlobalDisplayName ?? userInfo.displayName
    const backgroundImage = prefs
        ? prefs[Prefs.PROFILE_BACKGROUND]
        : DefaultPreferences[Prefs.PROFILE_BACKGROUND]
    return (
        <main className={styles["main"]}>
            <Head>
                <title>{`${name} | RaidHub`}</title>
            </Head>
            <section className={styles["user-info"]}>
                <UserCard
                    userInfo={{ ...membership, ...userInfo }}
                    emblemBackgroundPath={emblemBackgroundPath}
                    backgroundImage={backgroundImage.replace(/;$/, "")}
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

                <ClanCard {...userInfo} />
            </section>
            <section className={styles["content"]}>
                <div className={styles["mid"]}>
                    <PinnedActivity activityId={"4129239230"} />
                    <div className={styles["layout-toggle"]}>
                        <span>X</span>
                        <ToggleSwitch defaultState={!!layout} onToggle={handleToggle} />
                        <span>O</span>
                    </div>
                </div>
                <RaidCards
                    membershipId={userInfo.membershipId}
                    membershipType={userInfo.membershipType}
                    characterIds={characterIds}
                    layout={layout}
                />
            </section>
        </main>
    )
}

export default Profile
