import { useEffect, useState } from "react"
import { DefaultPreferences, PrefType, Prefs } from "../util/preferences";

type PrefsRecord<T extends Prefs[]> = {
    [K in T[number]]: PrefType<K>;
};

type UsePrefs<T extends Prefs[]> = { isLoading: boolean, prefs: PrefsRecord<T> | undefined }

export function usePrefs<T extends Prefs[]>(prefs: [...T]): UsePrefs<T> {
    const [isLoading, setLoading] = useState<boolean>(true)
    const [fetchedPrefs, setFetchedPrefs] = useState<PrefsRecord<T> | undefined>(undefined)

    useEffect(() => {
        const temp = {} as PrefsRecord<T>
        for (const pref of prefs) {
            temp[pref] = DefaultPreferences[pref]
        }
        setLoading(false)
        setFetchedPrefs(temp)
    }, [])
    
    return {
        isLoading: isLoading,
        prefs: fetchedPrefs
    };
}