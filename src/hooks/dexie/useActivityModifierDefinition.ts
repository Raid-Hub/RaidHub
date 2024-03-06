import { useDexieBulkGetQuery, useDexieGetQuery } from "~/util/dexie"

export const useActivityModifierDefinition = (hash: number) =>
    useDexieGetQuery("activityModifiers", hash)

export const useActivityModifierDefinitions = (hashes: number[]) =>
    useDexieBulkGetQuery("activityModifiers", hashes)
