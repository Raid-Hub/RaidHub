import { useLiveQuery } from "dexie-react-hooks"
import { indexDB } from "~/util/dexie"

export const useActivityModifierDefinition = (hash: number) =>
    useLiveQuery(() => indexDB.activityModifiers.get({ hash })) ?? null

export const useActivityModifierDefinitions = (hashes: number[]) =>
    useLiveQuery(() => indexDB.activityModifiers.bulkGet(hashes)) ?? null
