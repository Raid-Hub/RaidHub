import { useDexieGetQuery } from "~/util/dexie/useDexieGetQuery"

export const useItemDefinition = (hash: number) => useDexieGetQuery("items", hash)
