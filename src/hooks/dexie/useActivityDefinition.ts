import { useDexieGetQuery } from "~/util/dexie"

export const useActivityDefinition = (hash: string | number) =>
    useDexieGetQuery("activities", Number(hash))
