import styles from "../../styles/profile.module.css"
import { ErrorHandler } from "../../types/generic"
import Head from "next/head"
import UserCard from "./UserCard"
import ClanCard from "./ClanCard"
import PinnedActivity from "./PinnedActivity"
import RaidCards, { Layout } from "./raids/RaidCards"
import ToggleSwitch from "./raids/ToggleSwitch"
import { useState } from "react"
import { useDestinyStats } from "../../hooks/bungie/useDestinyStats"
import { useCharacterStats } from "../../hooks/bungie/useCharacterStats"
import { useRaidHubProfile } from "../../hooks/raidhub/useRaidHubProfile"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { useDestinyProfile } from "../../hooks/bungie/useDestinyProfile"
import Loading from "../global/Loading"
import { useBungieMemberships } from "../../hooks/bungie/useBungieMemberships"
import { usePlayers } from "../../hooks/raidreport/usePlayers"
import { Banners } from "./Banners"

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

    const { player, isLoading: isLoadingPlayer } = usePlayers({
        destinyMembershipIds: destinyProfiles,
        primaryMembershipId: destinyMembershipId,
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
                {isLoadingPlayer ? (
                    <Loading wrapperClass={styles["ranking-banners"]} />
                ) : (
                    player && (
                        <Banners
                            destinyMembershipId={destinyMembershipId}
                            banners={[player.speedRank, player.clearsRank]}
                        />
                    )
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
                        characterProfiles={characterProfiles}
                        isLoadingCharacters={isLoadingProfileStats}
                        layout={layout}
                        raidMetrics={raidMetrics}
                        isLoadingRaidMetrics={isLoadingRaidMetrics}
                        raidReport={player?.activities || null}
                        isLoadingRaidReport={isLoadingPlayer}
                        errorHandler={errorHandler}
                    />
                </section>
            )}
        </main>
    )
}

export default Profile
