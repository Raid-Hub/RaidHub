import type {
    RaidHubRaidPath,
    RaidHubWorldFirstLeaderboardCategory
} from "~/services/raidhub/types"

export const ENTRIES_PER_PAGE = 50

export const createQueryKey = (props: {
    category: RaidHubWorldFirstLeaderboardCategory
    raidPath: RaidHubRaidPath
    page: number
}) => ["raidhub", "leaderboard", "world first", props.raidPath, props.category, props.page] as const
