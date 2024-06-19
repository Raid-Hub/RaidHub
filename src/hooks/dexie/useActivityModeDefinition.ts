import { useDexieGetQuery } from "~/util/dexie/useDexieGetQuery"

export const useActivityModeDefinition = (hash: string | number) =>
    useDexieGetQuery("activityModes", Number(hash))
