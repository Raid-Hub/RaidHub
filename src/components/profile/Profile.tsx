import styles from "~/styles/pages/profile/profile.module.css"
import Head from "next/head"
import UserCard from "./user/UserCard"
import ClanCard from "./clan/ClanCard"
import PinnedActivity from "./mid/PinnedActivity"
import { trpc } from "~/util/trpc"
import { createContext, useContext, useMemo, useRef, useState } from "react"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { useActivityFilters } from "~/hooks/util/useActivityFilters"
import Raids from "./raids/Raids"
import CurrentActivity from "./mid/CurrentActivity"
import { ActivityFilter, InitialProfileProps } from "~/types/profile"
import FilterSelector from "./mid/FilterSelector"
import LayoutToggle, { Layout } from "./mid/LayoutToggle"
import Loading from "../global/Loading"
import { useBungieClient } from "../app/TokenManager"
import Activity from "~/models/profile/data/Activity"
import { PortalProvider } from "../reusable/Portal"

const PropsContext = createContext<InitialProfileProps | undefined>(undefined)
const FilterContext = createContext<ActivityFilter | null | undefined>(undefined)

export const useProfileProps = () => {
    const ctx = useContext(PropsContext)
    if (ctx === undefined) throw Error("This hook must be used inside the profile")
    return ctx
}

export const useFilterContext = () => {
    const ctx = useContext(FilterContext)
    if (ctx === undefined)
        throw Error("This hook must be used inside the raids part of the profile")
    return (activity: Activity) => {
        try {
            return ctx?.predicate?.(activity) ?? true
        } catch (e) {
            // we've hit an error with the saved filter
            return true
        }
    }
}

const Profile = ({ destinyMembershipId, destinyMembershipType }: InitialProfileProps) => {
    const bungie = useBungieClient()
    const mainRef = useRef<HTMLElement | null>(null)

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
            })) ?? [
                {
                    destinyMembershipId,
                    membershipType: destinyMembershipType
                }
            ],
        [membershipsData, destinyMembershipId, destinyMembershipType]
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

    const { activeFilter, setActiveFilter, isFilterMounted } = useActivityFilters()

    const username =
        raidHubProfile?.name ??
        primaryDestinyProfile?.profile.data?.userInfo.bungieGlobalDisplayName ??
        primaryDestinyProfile?.profile.data?.userInfo.displayName

    const title = username ? `${username} | RaidHub` : "RaidHub"
    const description = `View ${
        username ? `${username}'s ` : ""
    }raid stats, achievements, tags, and more`

    return (
        <PropsContext.Provider value={{ destinyMembershipId, destinyMembershipType }}>
            <Head>
                <title key="title">{title}</title>
                <meta key="description" name="description" content={description} />
                <meta key="og-title" property="og:title" content={title} />
                <meta key="og-descriptions" property="og:description" content={description} />
            </Head>
            <main className={styles["main"]} ref={mainRef}>
                <PortalProvider target={mainRef}>
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
                        <div
                            style={{
                                display: "flex",
                                gap: "1em",
                                flexWrap: "wrap",
                                justifyContent: "center"
                            }}>
                            <LayoutToggle handleLayoutToggle={handleLayoutToggle} layout={layout} />
                            {isFilterMounted && (
                                <FilterSelector
                                    activeFilter={activeFilter}
                                    setActiveFilter={setActiveFilter}
                                />
                            )}
                        </div>
                    </section>

                    <section className={styles["raids"]}>
                        <FilterContext.Provider value={activeFilter}>
                            <Raids
                                destinyMemberships={destinyMemberships}
                                areMembershipsFetched={areMembershipsFetched}
                                layout={layout}
                                setMostRecentActivity={setMostRecentActivity}
                            />
                        </FilterContext.Provider>
                    </section>
                </PortalProvider>
            </main>
        </PropsContext.Provider>
    )
}

export default Profile
