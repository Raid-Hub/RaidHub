import { useLiveQuery } from "dexie-react-hooks"
import { indexDB } from "~/util/dexie"

export function useSeasons(opts?: { reversed?: boolean }) {
    const allSeasons = useLiveQuery(() => indexDB.seasons.toArray()) ?? null
    return (
        allSeasons?.sort((a, b) => (a.seasonNumber - b.seasonNumber) * (opts?.reversed ? -1 : 1)) ??
        null
    )
}
