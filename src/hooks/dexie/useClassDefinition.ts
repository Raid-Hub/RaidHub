import { useDexieGetQuery } from "~/util/dexie"

export const useClassDefinition = (hash: string | number) =>
    useDexieGetQuery("characterClasses", Number(hash))
