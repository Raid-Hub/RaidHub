import { getWorldfirstLeaderboard } from "~/services/raidhub/getLeaderboard"
import type {
    RaidHubRaidPath,
    RaidHubWorldFirstLeaderboardCategory
} from "~/services/raidhub/types"
import { WorldfirstEntries } from "./WorldfirstEntries"
import { ENTRIES_PER_PAGE } from "./constants"

export const WorldfirstSSREntries = async (props: {
    page: string
    raidPath: RaidHubRaidPath
    category: RaidHubWorldFirstLeaderboardCategory
}) => {
    const ssr =
        props.page === "1"
            ? await getWorldfirstLeaderboard({
                  category: props.category,
                  raid: props.raidPath,
                  page: 1,
                  count: ENTRIES_PER_PAGE
              }).catch(() => undefined)
            : undefined

    return (
        <WorldfirstEntries
            category={props.category}
            raidPath={props.raidPath}
            ssr={ssr?.response}
            ssrPage={props.page}
            ssrUpdatedAt={new Date(ssr?.minted ?? Date.now()).getTime()}
        />
    )
}
