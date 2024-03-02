import { getIndividualGlobalLeaderboard } from "~/services/raidhub/getLeaderboard"
import type { RaidHubGlobalLeaderboardCategory } from "~/types/raidhub-api"
import { GlobalEntriesClient } from "./GlobalEntriesClient"
import { ENTRIES_PER_PAGE } from "./constants"

export const GlobalEntries = async (props: {
    category: RaidHubGlobalLeaderboardCategory
    page: number
}) => {
    const ssrData = await getIndividualGlobalLeaderboard(
        {
            board: props.category,
            page: props.page,
            count: ENTRIES_PER_PAGE
        },
        {
            next: {
                revalidate: 3600
            }
        }
    ).catch(() => null)

    const lastRevalidated = new Date()

    return (
        <GlobalEntriesClient
            lastRevalidated={lastRevalidated}
            ssrData={ssrData}
            category={props.category}
        />
    )
}
