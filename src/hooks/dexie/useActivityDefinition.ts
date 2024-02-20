import { useLiveQuery } from "dexie-react-hooks"
import { indexDB } from "~/util/dexie"

export function useActivityDefinition(hash: number) {
    return useLiveQuery(() => indexDB.activities.get({ hash }), [hash]) ?? null
}
