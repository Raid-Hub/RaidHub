import { useMemo } from "react"
import { useDexieBulkGetQuery, useDexieGetQuery } from "~/util/dexie"

export const useItemDefinition = (hash: number) => useDexieGetQuery("items", hash)

export const useItemDefinitions = (hashes: (number | string)[]) => {
    const numberHashes = useMemo(() => hashes.map(Number), [hashes])
    return useDexieBulkGetQuery("items", numberHashes)
}
