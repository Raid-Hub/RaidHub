import type {
    RaidHubIndividualLeaderboardCategory,
    RaidHubRaidPath
} from "~/services/raidhub/types"

export const ENTRIES_PER_PAGE = 50

export const createQueryKey = (props: {
    category: RaidHubIndividualLeaderboardCategory
    raidPath: RaidHubRaidPath
    page: number
}) => ["raidhub", "leaderboard", "individual", props.raidPath, props.category, props.page] as const
