import { useLiveQuery } from "dexie-react-hooks"
import { indexDB } from "~/util/dexie"

export function useActivityModeDefinition(hash: number) {
    return useLiveQuery(() => indexDB.activityModes.get({ hash })) ?? null
}
