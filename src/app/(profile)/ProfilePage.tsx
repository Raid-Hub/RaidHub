import { Flex } from "~/components/layout/Flex"
import { ProfileStateManager } from "./ProfileStateManager"
import { UserCard } from "./UserCard"
import { Raids } from "./raids/RaidsLayout"

export function ProfilePage() {
    return (
        <ProfileStateManager>
            <Flex $direction="column" $padding={0}>
                <UserCard />

                {/* <section className={styles["mid"]}>
                <CurrentActivity />
                {pinnedActivityId ? (
                    <PinnedActivity
                        activityId={pinnedActivityId}
                        isLoadingActivities={mostRecentActivity === undefined}
                        isLoadingRaidHubProfile={isLoadingRaidHubProfile}
                        isPinned={pinnedActivityId === raidHubProfile?.pinnedActivityId}
                    />
                ) : (
                    pinnedActivityId === undefined && (
                        <Loading  />
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
            </section> */}

                {/* <FilterContext.Provider value={activeFilter}> */}
                <Raids />
                {/* </FilterContext.Provider> */}
            </Flex>
        </ProfileStateManager>
    )
}
