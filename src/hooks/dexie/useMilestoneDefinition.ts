import { useDexieGetQuery } from "~/util/dexie/useDexieGetQuery"

export const useMilestoneDefinition = (hash: string | number) =>
    useDexieGetQuery("milestones", Number(hash))
