import { type RaidHubGlobalLeaderboardCategory } from "~/services/raidhub/types"

export const ENTRIES_PER_PAGE = 50

export const createQueryKey = (props: {
    category: RaidHubGlobalLeaderboardCategory
    page: number
}) => ["raidhub", "leaderboard", "global", props.category, props.page] as const
