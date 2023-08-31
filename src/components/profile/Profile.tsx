import styles from "../../styles/pages/profile/profile.module.css"
import { ErrorHandler } from "../../types/generic"
import Head from "next/head"
import UserCard from "./user/UserCard"
import ClanCard from "./clan/ClanCard"
import PinnedActivity from "./mid/PinnedActivity"
import { useState } from "react"
import { useDestinyStats } from "../../hooks/bungie/useDestinyStats"
import { useCharacterStats } from "../../hooks/bungie/useCharacterStats"
import { useRaidHubProfile } from "../../hooks/raidhub/useRaidHubProfile"
import { useDestinyProfile } from "../../hooks/bungie/useDestinyProfile"
import { useBungieMemberships } from "../../hooks/bungie/useBungieMemberships"
import { useRaidReport } from "../../hooks/raidreport/useRaidReportData"
import Banners from "./banners/Banners"
import Raids from "./raids/Raids"
import CurrentActivity from "./mid/CurrentActivity"
import { InitialProfileProps } from "../../types/profile"
import FilterSelector from "./mid/FilterSelector"
import { useActivityFilters } from "../../hooks/util/useActivityFilters"
import LayoutToggle, { Layout } from "./mid/LayoutToggle"
import { useLocalStorage } from "../../hooks/util/useLocalStorage"
import Loading from "../global/Loading"

type ProfileProps = InitialProfileProps & {
    errorHandler: ErrorHandler
}

const Profile = ({ destinyMembershipId, destinyMembershipType, errorHandler }: ProfileProps) => {
    // DATA HOOKS
    const { data: primaryDestinyProfile, isLoading: isLoadingDestinyProfile } = useDestinyProfile({
        destinyMembershipId,
        destinyMembershipType,
        errorHandler
    })

    const { data: raidHubProfile, isLoading: isLoadingRaidHubProfile } = useRaidHubProfile({
        destinyMembershipId,
        errorHandler: () => null
    })

    const { data: membershipsData, isLoading: isLoadingMemberships } = useBungieMemberships({
        destinyMembershipId,
        destinyMembershipType,
        errorHandler
    })

    const { data: raidReportData, isLoading: isLoadingRaidReportData } = useRaidReport({
        destinyMembershipIds: membershipsData?.destinyMemberships ?? null,
        primaryMembershipId: destinyMembershipId,
        errorHandler
    })

    const { data: destinyStats, isLoading: isLoadingDestinyStats } = useDestinyStats({
        destinyMemberships: membershipsData?.destinyMemberships ?? null,
        errorHandler
    })

    const { data: characterStats, isLoading: isLoadingRaidMetrics } = useCharacterStats({
        characterMemberships: destinyStats?.characterMemberships ?? null,
        errorHandler
    })

    const [mostRecentActivity, setMostRecentActivity] = useState<string | undefined | null>(
        undefined
    )

    const pinnedActivity = raidHubProfile?.profile?.pinnedActivityId ?? mostRecentActivity

    // LAYOUT
    const { value: layout, save: setLayout } = useLocalStorage("profile-layout", Layout.DotCharts)

    const handleLayoutToggle = (buttonState: boolean) => {
        const newState = buttonState ? Layout.RecentActivities : Layout.DotCharts
        setLayout(newState)
    }

    const [activeFilter, setActiveFilter, isLoadingFilters] = useActivityFilters()

    const name =
        primaryDestinyProfile?.userInfo.bungieGlobalDisplayName ??
        primaryDestinyProfile?.userInfo.displayName

    return (
        <main className={styles["main"]}>
            <Head>
                <title>{name ? `${name} | RaidHub` : "RaidHub"}</title>
            </Head>
            <section className={styles["user-info"]}>
                <UserCard
                    isLoading={
                        isLoadingDestinyProfile || isLoadingRaidHubProfile || isLoadingMemberships
                    }
                    userInfo={
                        membershipsData?.bungieMembership
                            ? {
                                  ...membershipsData.bungieMembership,
                                  ...primaryDestinyProfile?.userInfo
                              }
                            : undefined
                    }
                    raidHubProfile={raidHubProfile ?? null}
                    destinyMembershipId={destinyMembershipId}
                    emblemBackgroundPath={primaryDestinyProfile?.emblemBackgroundPath}
                />
                <Banners
                    banners={raidReportData?.rankings ?? null}
                    destinyMembershipId={destinyMembershipId}
                    isLoading={isLoadingRaidReportData || isLoadingMemberships}
                />
                <ClanCard
                    membershipId={destinyMembershipId}
                    membershipType={destinyMembershipType}
                />
            </section>

            <section className={styles["mid"]}>
                <CurrentActivity
                    destinyMembershipId={destinyMembershipId}
                    destinyMembershipType={destinyMembershipType}
                />
                {pinnedActivity ? (
                    <PinnedActivity
                        activityId={pinnedActivity}
                        isLoadingActivities={mostRecentActivity === undefined}
                        isLoadingRaidHubProfile={isLoadingRaidHubProfile}
                        isPinned={!!raidHubProfile?.profile?.pinnedActivityId}
                        errorHandler={errorHandler}
                    />
                ) : (
                    pinnedActivity === undefined && (
                        <Loading wrapperClass={styles["pinned-activity-loading"]} />
                    )
                )}
                <LayoutToggle handleLayoutToggle={handleLayoutToggle} layout={layout} />
                {!isLoadingFilters && (
                    <FilterSelector activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                )}
            </section>

            <section className={styles["raids"]}>
                <Raids
                    membershipId={destinyMembershipId}
                    characterMemberships={destinyStats?.characterMemberships ?? null}
                    layout={layout}
                    filter={activity => activeFilter?.predicate?.(activity) ?? true}
                    raidMetrics={characterStats ?? null}
                    raidReport={raidReportData?.activities || null}
                    isLoadingRaidMetrics={
                        isLoadingMemberships || isLoadingDestinyStats || isLoadingRaidMetrics
                    }
                    isLoadingCharacters={isLoadingMemberships || isLoadingDestinyStats}
                    isLoadingRaidReport={isLoadingRaidReportData}
                    setMostRecentActivity={setMostRecentActivity}
                    errorHandler={errorHandler}
                />
            </section>
        </main>
    )
}

export default Profile
