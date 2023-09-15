import styles from "~/styles/pages/profile/profile.module.css"
import Head from "next/head"
import UserCard from "./user/UserCard"
import ClanCard from "./clan/ClanCard"
import PinnedActivity from "./mid/PinnedActivity"
import { trpc } from "~/util/trpc"
import { createContext, useContext, useMemo, useState } from "react"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useActivityFilters } from "~/hooks/util/useActivityFilters"
import Raids from "./raids/Raids"
import CurrentActivity from "./mid/CurrentActivity"
import { InitialProfileProps } from "~/types/profile"
import FilterSelector from "./mid/FilterSelector"
import LayoutToggle, { Layout } from "./mid/LayoutToggle"
import Loading from "../global/Loading"
import { useBungieClient } from "../app/TokenManager"

const PropsContext = createContext<InitialProfileProps | null>(null)

export const useProfileProps = () => {
    const ctx = useContext(PropsContext)
    if (!ctx) throw Error("This hook must be used inside the profile")
    return ctx
}

const Profile = ({ destinyMembershipId, destinyMembershipType }: InitialProfileProps) => {
    const bungie = useBungieClient()

    // DATA HOOKS
    const { data: raidHubProfile, isLoading: isLoadingRaidHubProfile } =
        trpc.profile.byDestinyMembershipId.useQuery({
            destinyMembershipId
        })

    const { data: primaryDestinyProfile } = bungie.profile.useQuery(
        {
            destinyMembershipId,
            membershipType: destinyMembershipType
        },
        { staleTime: 5 * 60000 }
    )

    const { data: membershipsData, isFetched: areMembershipsFetched } =
        bungie.linkedProfiles.useQuery({
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

    const [mostRecentActivity, setMostRecentActivity] = useState<string | undefined | null>(
        undefined
    )

    const pinnedActivityId = raidHubProfile?.pinnedActivityId ?? mostRecentActivity

    // LAYOUT
    const { value: layout, save: setLayout } = useLocalStorage("profile-layout", Layout.DotCharts)

    const handleLayoutToggle = (buttonState: boolean) => {
        const newState = buttonState ? Layout.RecentActivities : Layout.DotCharts
        setLayout(newState)
    }

    const [activeFilter, setActiveFilter, isFilterMounted] = useActivityFilters()

    const username =
        raidHubProfile?.name ??
        primaryDestinyProfile?.profile.data?.userInfo.bungieGlobalDisplayName ??
        primaryDestinyProfile?.profile.data?.userInfo.displayName

    return (
        <>
            <Head>
                <title key="title">{username ? `${username} | RaidHub` : "RaidHub"}</title>
            </Head>
            <PropsContext.Provider value={{ destinyMembershipId, destinyMembershipType }}>
                <main className={styles["main"]}>
                    <section className={styles["user-info"]}>
                        <UserCard />
                        <ClanCard />
                    </section>

                    <section className={styles["mid"]}>
                        {primaryDestinyProfile?.characterActivities?.data && (
                            <CurrentActivity
                                activitiesComponent={
                                    Object.values(
                                        primaryDestinyProfile.characterActivities.data
                                    ).sort(
                                        (a, b) =>
                                            new Date(b.dateActivityStarted).getTime() -
                                            new Date(a.dateActivityStarted).getTime()
                                    )[0]
                                }
                            />
                        )}
                        {pinnedActivityId ? (
                            <PinnedActivity
                                activityId={pinnedActivityId}
                                isLoadingActivities={mostRecentActivity === undefined}
                                isLoadingRaidHubProfile={isLoadingRaidHubProfile}
                                isPinned={pinnedActivityId === raidHubProfile?.pinnedActivityId}
                            />
                        ) : (
                            pinnedActivityId === undefined && (
                                <Loading className={styles["pinned-activity-loading"]} />
                            )
                        )}
                        <LayoutToggle handleLayoutToggle={handleLayoutToggle} layout={layout} />
                        {isFilterMounted && (
                            <FilterSelector
                                activeFilter={activeFilter}
                                setActiveFilter={setActiveFilter}
                            />
                        )}
                    </section>

                    <section className={styles["raids"]}>
                        <Raids
                            destinyMemberships={destinyMemberships}
                            areMembershipsFetched={areMembershipsFetched}
                            layout={layout}
                            filter={activity => activeFilter?.predicate?.(activity) ?? true}
                            setMostRecentActivity={setMostRecentActivity}
                        />
                    </section>
                </main>
            </PropsContext.Provider>
        </>
    )
}

export default Profile
