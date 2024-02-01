import { useLiveQuery } from "dexie-react-hooks"
import { indexDB } from "~/util/dexie"

export function useActivityDefiition(hash: number) {
    return useLiveQuery(() => indexDB.activities.get({ hash })) ?? null
}
