import { getIndividualGlobalLeaderboard } from "~/services/raidhub/getLeaderboard"
import type { RaidHubGlobalLeaderboardCategory } from "~/services/raidhub/types"
import { GlobalEntries } from "./GlobalEntries"
import { ENTRIES_PER_PAGE } from "./constants"

export const GlobalSSREntries = async (props: {
    page: string
    category: RaidHubGlobalLeaderboardCategory
}) => {
    const ssr =
        props.page === "1"
            ? await getIndividualGlobalLeaderboard({
                  board: props.category,
                  page: 1,
                  count: ENTRIES_PER_PAGE
              }).catch(() => undefined)
            : undefined

    return (
        <GlobalEntries
            category={props.category}
            ssr={ssr?.response}
            ssrPage={props.page}
            ssrUpdatedAt={new Date(ssr?.minted ?? Date.now()).getTime()}
        />
    )
}
