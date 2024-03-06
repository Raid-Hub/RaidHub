import { LeaderboardEntries } from "./LeaderboardEntries"
import { LeaderboardEntriesLoading } from "./LeaderboardEntriesLoading"
import { type UseLeaderboardResult } from "./useLeaderboard"

export const LeaderboardEntriesLoadingWrapper = ({
    icons,
    ...query
}: UseLeaderboardResult & { icons?: Record<number, JSX.Element> }) => {
    if (query.isFetching) {
        return <LeaderboardEntriesLoading />
    } else {
        return <LeaderboardEntries entries={query.data ?? []} icons={icons} />
    }
}
