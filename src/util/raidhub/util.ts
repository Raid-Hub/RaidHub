import { Raid } from "~/data/raid"
import { type ListedRaid } from "~/services/raidhub/types"
import { includedIn } from "../helpers"

export const isRaid = (activityId: ListedRaid | 101): activityId is ListedRaid =>
    includedIn(Object.values(Raid), activityId)
