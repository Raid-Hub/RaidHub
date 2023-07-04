import styles from "../../styles/profile.module.css"
import { ErrorHandler } from "../../types/generic"
import Head from "next/head"
import UserCard from "./UserCard"
import RankingBanner from "./RankingBanner"
import { Founders } from "../../util/raidhub/special"
import ClanCard from "./ClanCard"
import PinnedActivity from "./PinnedActivity"
import RaidCards, { Layout } from "./RaidCards"
import ToggleSwitch from "./ToggleSwitch"
import { useState } from "react"
import { Icons } from "../../util/presentation/icons"
import { useDestinyStats } from "../../hooks/bungie/useDestinyStats"
import { useCharacterStats } from "../../hooks/bungie/useCharacterStats"
import { useRaidHubProfile } from "../../hooks/raidhub/useRaidHubProfile"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { useDestinyProfile } from "../../hooks/bungie/useDestinyProfile"
import Loading from "../global/Loading"
import { useBungieMemberships } from "../../hooks/bungie/useBungieMemberships"

type ProfileProps = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

const Profile = ({ destinyMembershipId, membershipType, errorHandler }: ProfileProps) => {
    // DATA HOOKS
    const { profile, isLoading: isLoadingProfile } = useDestinyProfile({
        destinyMembershipId,
        membershipType,
        errorHandler
    })

    const { profile: raidHubProfile, isLoading: isLoadingRaidHubProfile } = useRaidHubProfile({
        destinyMembershipId,
        errorHandler
    })

    const {
        membership,
        destinyProfiles,
        isLoading: isLoadingProfiles
    } = useBungieMemberships({
        destinyMembershipId,
        membershipType,
        errorHandler
    })

    const {
        stats: profileStats,
        isLoading: isLoadingProfileStats,
        characterProfiles
    } = useDestinyStats({ destinyProfiles, errorHandler })

    const { stats: raidMetrics, isLoading: isLoadingRaidMetrics } = useCharacterStats({
        characterProfiles,
        errorHandler
    })

    // LAYOUT
    const [layout, setLayout] = useState<Layout>(Layout.DotCharts)

    const handleLayoutToggle = (buttonState: boolean) => {
        const newState = buttonState ? Layout.RecentActivities : Layout.DotCharts
        setLayout(newState)
    }

    const name = profile?.userInfo.bungieGlobalDisplayName ?? profile?.userInfo.displayName

    return (
        <main className={styles["main"]}>
            <Head>
                <title>{name ? `${name} | RaidHub` : "RaidHub"}</title>
            </Head>
            <section className={styles["user-info"]}>
                <UserCard
                    isLoading={isLoadingProfile}
                    userInfo={membership ? { ...membership, ...profile?.userInfo } : undefined}
                    socials={raidHubProfile?.socials}
                    emblemBackgroundPath={profile?.emblemBackgroundPath}
                    backgroundImage={raidHubProfile?.background?.replace(/;$/, "") ?? ""}
                />
                {profile ? (
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
                            <span>Lowman Rank</span>
                            <span className={styles["banner-bold"]}>Diamond IV</span>
                            <span>69</span>
                        </RankingBanner>
                        {Object.keys(Founders).includes(profile.userInfo.membershipId) && (
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
                ) : (
                    <Loading wrapperClass={styles["ranking-banners"]} />
                )}
                <ClanCard
                    membershipId={destinyMembershipId}
                    membershipType={membershipType}
                    errorHandler={errorHandler}
                />
            </section>
            {profile && (
                <section className={styles["content"]}>
                    <div className={styles["mid"]}>
                        {raidHubProfile && (
                            <PinnedActivity
                                activityId={raidHubProfile.pinnedActivity}
                                errorHandler={errorHandler}
                            />
                        )}
                        <div className={styles["layout-toggle"]}>
                            <span className={styles["description-toggle"]}>Raids</span>
                            <ToggleSwitch defaultState={!!layout} onToggle={handleLayoutToggle} />
                            <span className={styles["description-toggle"]}>History</span>
                        </div>
                    </div>
                    <RaidCards
                        {...profile.userInfo}
                        profile={raidHubProfile}
                        characterProfiles={characterProfiles}
                        layout={layout}
                        raidMetrics={raidMetrics}
                        isLoadingRaidMetrics={isLoadingRaidMetrics}
                        errorHandler={errorHandler}
                    />
                </section>
            )}
        </main>
    )
}

export default Profile
