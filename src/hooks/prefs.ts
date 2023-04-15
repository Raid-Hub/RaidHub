import { useEffect, useState } from "react"
import { DefaultPreferences, NewoPrefs, PrefType, Prefs } from "../util/preferences"

type PrefsRecord<T extends Prefs[]> = {
    [K in T[number]]: PrefType<K>
}

type UsePrefs<T extends Prefs[]> = {
    isLoading: boolean
    prefs: PrefsRecord<T> | undefined
}

export function usePrefs<T extends Prefs[]>(id: string, prefs: [...T]): UsePrefs<T> {
    const [isLoading, setLoading] = useState<boolean>(true)
    const [fetchedPrefs, setFetchedPrefs] = useState<PrefsRecord<T> | undefined>(undefined)

    useEffect(() => {
        setLoading(true)
        // TODO: this is temporary
        const temp = {} as PrefsRecord<T>
        for (const pref of prefs) {
            temp[pref] = id === "4611686018488107374" ? NewoPrefs[pref] : DefaultPreferences[pref]
        }
        setLoading(false)
        setFetchedPrefs(temp)
    }, [id])

    return {
        isLoading: isLoading,
        prefs: fetchedPrefs
    }
}
