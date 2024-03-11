import { useDexieGetQuery } from "~/util/dexie"

export const useActivityModifierDefinition = (hash: number) =>
    useDexieGetQuery("activityModifiers", hash)
