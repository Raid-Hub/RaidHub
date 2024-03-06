import { type RTABoardCategory } from "~/data/speedrun-com-mappings"
import { type ListedRaid } from "~/services/raidhub/types"
import { getSpeedrunComLeaderboard } from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import { SpeedrunEntries } from "./SpeedrunEntries"

export const SpeedrunSSREntries = async (props: {
    raid: ListedRaid
    category?: RTABoardCategory
}) => {
    const ssrData = await getSpeedrunComLeaderboard(props).catch(() => null)

    return <SpeedrunEntries lastRevalidated={Date.now()} ssrData={ssrData} {...props} />
}
