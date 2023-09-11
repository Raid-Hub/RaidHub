import styles from "~/styles/pages/profile/profile.module.css"
import Head from "next/head"
import UserCard from "./user/UserCard"
import ClanCard from "./clan/ClanCard"
import PinnedActivity from "./mid/PinnedActivity"
import { trpc } from "~/util/trpc"
import { useMemo, useState } from "react"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useActivityFilters } from "~/hooks/util/useActivityFilters"
import Raids from "./raids/Raids"
import CurrentActivity from "./mid/CurrentActivity"
import { InitialProfileProps } from "~/types/profile"
import FilterSelector from "./mid/FilterSelector"
import LayoutToggle, { Layout } from "./mid/LayoutToggle"
import Loading from "../global/Loading"
import { useBungieClient } from "../app/TokenManager"

const Profile = ({ destinyMembershipId, destinyMembershipType }: InitialProfileProps) => {
    const bungie = useBungieClient()
    // DATA HOOKS
    const { data: raidHubProfile, isLoading: isLoadingRaidHubProfile } =
        trpc.profile.getProfile.useQuery({
            destinyMembershipId
        })

    const { data: primaryDestinyProfile, dataUpdatedAt: profileUpdatedAt } =
        bungie.profile.useQuery(
            {
                destinyMembershipId,
                membershipType: destinyMembershipType
            },
            { staleTime: 5 * 60000 }
        )

    const { data: membershipsData } = bungie.linkedProfiles.useQuery({
        membershipId: destinyMembershipId
    })

    const destinyMemberships = useMemo(
        () =>
            membershipsData?.profiles.map(p => ({
                destinyMembershipId: p.membershipId,
                membershipType: p.membershipType
            })) ?? [],
        [membershipsData]
    )

    const statsQueries = bungie.stats.useQueries(destinyMemberships)

    const characters = useMemo(
        () =>
            statsQueries
                .map(
                    q =>
                        q.data?.characters.map(({ characterId }) => ({
                            destinyMembershipId: q.data.destinyMembershipId,
                            membershipType: q.data.membershipType,
                            characterId
                        }))!
                )
                .filter(Boolean)
                .flat(),
        [statsQueries]
    )

    const characterQueries = bungie.characterStats.useQueries(characters)

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
                <UserCard />
                <ClanCard />
            </section>

            <section className={styles["mid"]}>
                {primaryDestinyProfile?.characterActivities.data &&
                    primaryDestinyProfile.profileTransitoryData.data && (
                        <CurrentActivity
                            profileUpdatedAt={profileUpdatedAt}
                            transitoryComponent={primaryDestinyProfile.profileTransitoryData.data}
                            activitiesComponent={
                                Object.values(primaryDestinyProfile.characterActivities.data).sort(
                                    (a, b) =>
                                        new Date(b.dateActivityStarted).getTime() -
                                        new Date(a.dateActivityStarted).getTime()
                                )[0]
                            }
                        />
                    )}
                {pinnedActivity ? (
                    <PinnedActivity
                        activityId={pinnedActivity}
                        isLoadingActivities={mostRecentActivity === undefined}
                        isLoadingRaidHubProfile={isLoadingRaidHubProfile}
                        isPinned={!!raidHubProfile?.pinnedActivityId}
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
                    characterMemberships={characters}
                    layout={layout}
                    filter={activity => activeFilter?.predicate?.(activity) ?? true}
                    setMostRecentActivity={setMostRecentActivity}
                />
            </section>
        </main>
    )
}

export default Profile
