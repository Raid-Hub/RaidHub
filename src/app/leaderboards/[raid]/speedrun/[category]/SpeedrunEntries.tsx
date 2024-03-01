import { type RTABoardCategory } from "~/data/speedrun-com-mappings"
import { getSpeedrunComLeaderboard } from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import { type ListedRaid } from "~/types/raidhub-api"
import { SpeedrunEntriesClient } from "./SpeedrunEntriesClient"

export const SpeedrunEntries = async (props: { raid: ListedRaid; category?: RTABoardCategory }) => {
    const ssrData = await getSpeedrunComLeaderboard(props, {
        next: {
            revalidate: 7200
        }
    }).catch(() => null)

    const lastRevalidated = new Date()

    return (
        <SpeedrunEntriesClient
            lastRevalidated={lastRevalidated}
            ssrData={ssrData}
            raid={props.raid}
        />
    )
}
