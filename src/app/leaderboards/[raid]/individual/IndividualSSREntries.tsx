import { getIndividualLeaderboard } from "~/services/raidhub/getLeaderboard"
import type {
    RaidHubIndividualLeaderboardCategory,
    RaidHubRaidPath
} from "~/services/raidhub/types"
import { IndividualEntries } from "./IndividualEntries"
import { ENTRIES_PER_PAGE } from "./constants"

export const IndividualSSREntries = async (props: {
    page: string
    raidPath: RaidHubRaidPath
    category: RaidHubIndividualLeaderboardCategory
}) => {
    const ssr =
        props.page === "1"
            ? await getIndividualLeaderboard({
                  category: props.category,
                  raid: props.raidPath,
                  page: 1,
                  count: ENTRIES_PER_PAGE
              }).catch(() => undefined)
            : undefined

    return (
        <IndividualEntries
            category={props.category}
            raidPath={props.raidPath}
            ssr={ssr?.response}
            ssrPage={props.page}
            ssrUpdatedAt={new Date(ssr?.minted ?? Date.now()).getTime()}
        />
    )
}
