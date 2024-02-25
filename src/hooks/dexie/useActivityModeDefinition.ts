import { useDexieGetQuery } from "~/util/dexie"

export const useActivityModeDefinition = (hash: string | number) =>
    useDexieGetQuery("activityModes", Number(hash))
