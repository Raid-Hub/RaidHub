import { useDexieGetQuery } from "~/util/dexie"

export const useItemDefinition = (hash: number) => useDexieGetQuery("items", hash)
