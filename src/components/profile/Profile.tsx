import styles from "~/styles/pages/profile/profile.module.css"
import { ErrorHandler } from "~/types/generic"
import Head from "next/head"
import UserCard from "./user/UserCard"
import ClanCard from "./clan/ClanCard"
import PinnedActivity from "./mid/PinnedActivity"
import { trpc } from "~/util/trpc"
import { useState } from "react"
import { useDestinyStats } from "~/hooks/bungie/useDestinyStats"
import { useCharacterStats } from "~/hooks/bungie/useCharacterStats"
import { useBungieMemberships } from "~/hooks/bungie/useBungieMemberships"
import { useRaidReport } from "~/hooks/raidreport/useRaidReportData"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useActivityFilters } from "~/hooks/util/useActivityFilters"
import Banners from "./banners/Banners"
import Raids from "./raids/Raids"
import CurrentActivity from "./mid/CurrentActivity"
import { InitialProfileProps } from "~/types/profile"
import FilterSelector from "./mid/FilterSelector"
import LayoutToggle, { Layout } from "./mid/LayoutToggle"
import Loading from "../global/Loading"
import { useBungieClient } from "../app/TokenManager"

type ProfileProps = InitialProfileProps & {
    errorHandler: ErrorHandler
}

const Profile = ({ destinyMembershipId, destinyMembershipType, errorHandler }: ProfileProps) => {
    const bungie = useBungieClient()
    // DATA HOOKS
    const { data: raidHubProfile, isLoading: isLoadingRaidHubProfile } =
        trpc.profile.getProfile.useQuery({
            destinyMembershipId
        })

    const { data: primaryDestinyProfile, isLoading: isLoadingDestinyProfile } =
        bungie.profile.useQuery(
            {
                destinyMembershipId,
                membershipType: destinyMembershipType
            },
            { staleTime: 5 * 60000 }
        )

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

    const pinnedActivity = raidHubProfile?.pinnedActivityId ?? mostRecentActivity

    // LAYOUT
    const { value: layout, save: setLayout } = useLocalStorage("profile-layout", Layout.DotCharts)

    const handleLayoutToggle = (buttonState: boolean) => {
        const newState = buttonState ? Layout.RecentActivities : Layout.DotCharts
        setLayout(newState)
    }

    const [activeFilter, setActiveFilter, isLoadingFilters] = useActivityFilters()

    const name =
        primaryDestinyProfile?.profile.data?.userInfo.bungieGlobalDisplayName ??
        primaryDestinyProfile?.profile.data?.userInfo.displayName

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
                                  ...primaryDestinyProfile?.profile.data?.userInfo
                              }
                            : undefined
                    }
                    raidHubProfile={raidHubProfile ?? null}
                    emblemBackgroundPathSrc={`https://www.bungie.net/${
                        Object.values(primaryDestinyProfile?.characters.data ?? {})[0]
                            ?.emblemBackgroundPath ??
                        "common/destiny2_content/icons/2644a073545e566485629b95989b5f83.jpg"
                    }`}
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
                        isPinned={!!raidHubProfile?.pinnedActivityId}
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
                    characterMemberships={destinyStats?.characterMemberships ?? []}
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
