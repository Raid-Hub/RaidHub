import { useLiveQuery } from "dexie-react-hooks"
import { useDexie } from "~/util/dexie/dexie"

export function useSeasons(opts?: { reversed?: boolean }) {
    const dexieDB = useDexie()
    const allSeasons = useLiveQuery(() => dexieDB.seasons.toArray().catch(() => []), []) ?? null
    return (
        allSeasons?.sort((a, b) => (a.seasonNumber - b.seasonNumber) * (opts?.reversed ? -1 : 1)) ??
        null
    )
}
