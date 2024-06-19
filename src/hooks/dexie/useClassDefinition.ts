import { useDexieGetQuery } from "~/util/dexie/useDexieGetQuery"

export const useClassDefinition = (hash: string | number) =>
    useDexieGetQuery("characterClasses", Number(hash))
