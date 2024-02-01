import { useLiveQuery } from "dexie-react-hooks"
import { indexDB } from "~/util/dexie"

export function useItemDefinition(hash: number) {
    return useLiveQuery(() => indexDB.items.get({ hash })) ?? null
}
