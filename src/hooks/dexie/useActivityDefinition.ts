import { useDexieGetQuery } from "~/util/dexie/useDexieGetQuery"

export const useActivityDefinition = (hash: string | number) =>
    useDexieGetQuery("activities", Number(hash))
