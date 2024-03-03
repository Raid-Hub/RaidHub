import { useDexieGetQuery } from "~/util/dexie"

export const useMilestoneDefinition = (hash: string | number) =>
    useDexieGetQuery("milestones", Number(hash))
