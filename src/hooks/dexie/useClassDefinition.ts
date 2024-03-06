import { useMemo } from "react"
import { useDexieBulkGetQuery, useDexieGetQuery } from "~/util/dexie"

export const useClassDefinition = (hash: string | number) =>
    useDexieGetQuery("characterClasses", Number(hash))

export const useClassDefinitions = (hashes: (string | number)[]) => {
    const numberHashes = useMemo(() => hashes.map(Number), [hashes])
    return useDexieBulkGetQuery("characterClasses", numberHashes)
}
