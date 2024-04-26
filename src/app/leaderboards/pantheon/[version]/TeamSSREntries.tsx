import { type RaidHubPantheonPath } from "~/services/raidhub/types"
import { ENTRIES_PER_PAGE, getTeamLeaderboard } from "../common"
import { TeamEntries } from "./TeamEntries"

export const SSREntries = async (props: {
    version: RaidHubPantheonPath
    page: string
    category: "first" | "speedrun"
}) => {
    const ssrData =
        props.page === "1"
            ? await getTeamLeaderboard({
                  category: props.category,
                  version: props.version,
                  page: 1,
                  count: ENTRIES_PER_PAGE
              })
            : undefined

    return (
        <TeamEntries
            category={props.category}
            ssr={ssrData}
            ssrUpdatedAt={Date.now()}
            pantheonPath={props.version}
            ssrPage={props.page}
        />
    )
}
