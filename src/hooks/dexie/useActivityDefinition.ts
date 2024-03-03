import { useDexieBulkGetQuery, useDexieGetQuery } from "~/util/dexie"

export const useActivityDefinition = (hash: string | number) =>
    useDexieGetQuery("activities", Number(hash))

export const useActivityDefinitions = (hashes: number[]) =>
    useDexieBulkGetQuery("activities", hashes)
