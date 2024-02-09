import { useLiveQuery } from "dexie-react-hooks"
import { indexDB } from "~/util/dexie"

export function useActivityModifierDefinition(hash: number) {
    return useLiveQuery(() => indexDB.activityModifiers.get({ hash })) ?? null
}
