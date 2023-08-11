import { useEffect, useState } from "react"

export type UseLocalStorage<V> = {
    value: V
    save: (value: V | ((old: V) => V)) => void
}

export const useLocalStorage = <V>(key: string, defaultVaule: V): UseLocalStorage<V> => {
    const [_value, setValue] = useState<V>(defaultVaule)

    useEffect(() => {
        const fromStore = localStorage.getItem(key)
        setValue(fromStore ? JSON.parse(fromStore) : defaultVaule)
    }, [key, defaultVaule])

    function save(value: V | ((old: V) => V)) {
        const toSave = typeof value === "function" ? (value as (old: V | null) => V)(_value) : value
        localStorage.setItem(key, JSON.stringify(toSave))
        setValue(toSave)
    }

    return {
        value: _value,
        save
    }
}
