import Head from "next/head"
import { createContext, useContext, useRef, useState } from "react"
import { useActivityFilters } from "~/hooks/util/useActivityFilters"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import Activity from "~/models/profile/data/Activity"
import { useRaidHubPlayers } from "~/services/raidhub/useRaidHubPlayers"
import styles from "~/styles/pages/profile/profile.module.css"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { PortalProvider } from "../../components/Portal"
import { Layout } from "./mid/LayoutToggle"

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

/** @deprecated */
const Profile = ({ destinyMembershipId, destinyMembershipType }: InitialProfileProps) => {
    const bungie = useBungieClient()
    const mainRef = useRef<HTMLElement | null>(null)

    // DATA HOOKS
    const { data: raidHubProfile, isLoading: isLoadingRaidHubProfile } =
        trpc.profile.byDestinyMembershipId.useQuery({
            destinyMembershipId
        })

    const [mostRecentActivity, setMostRecentActivity] = useState<string | undefined | null>(
        undefined
    )

    const pinnedActivityId = raidHubProfile?.pinnedActivityId ?? mostRecentActivity

    const { players, isLoading: isLoadingPlayers } = useRaidHubPlayers(
        destinyMemberships.map(dm => dm.destinyMembershipId)
    )

    // LAYOUT
    const [layout, setLayout] = useLocalStorage("profile-layout", Layout.DotCharts)

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

    const image =
        raidHubProfile?.image ??
        bungieIconUrl(primaryDestinyProfile?.profile.data?.userInfo.iconPath)

    return (
        <PropsContext.Provider value={{ destinyMembershipId, destinyMembershipType }}>
            <Head>
                <title key="title">{title}</title>
                <meta key="description" name="description" content={description} />

                {/* Facebook */}
                <meta key="og:title" property="og:title" content={title} />
                <meta key="og:description" property="og:description" content={description} />
                <meta key="og:image" property="og:image" content={image} />

                {/* Twitter */}
                <meta key="twitter:title" property="twitter:title" content={title} />
                <meta
                    key="twitter:descriptions"
                    property="twitter:description"
                    content={description}
                />
                <meta key="twitter:image" property="twitter:image" content={image} />
            </Head>
            <main className={styles["main"]} ref={mainRef}>
                <PortalProvider target={mainRef}></PortalProvider>
            </main>
        </PropsContext.Provider>
    )
}

export default Profile
