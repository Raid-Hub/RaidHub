import { useDexieGetQuery } from "~/util/dexie/useDexieGetQuery"

export const useActivityModifierDefinition = (hash: number) =>
    useDexieGetQuery("activityModifiers", hash)
