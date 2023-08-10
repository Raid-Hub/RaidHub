import { useEffect, useState } from "react"

export type UseLocalStorage<V> = {
    value: V | null
    save: (value: V | ((old: V | null) => V)) => void
}

export const useLocaleStorage = <V>(key: string): UseLocalStorage<V> => {
    const [_value, setValue] = useState<V | null>(null)

    useEffect(() => {
        const fromStore = localStorage.getItem(key)
        setValue(fromStore ? JSON.parse(fromStore) : null)
    }, [key])

    function save(value: V | ((old: V | null) => V)) {
        const toSave = typeof value === "function" ? (value as (old: V | null) => V)(_value) : value
        localStorage.setItem(key, JSON.stringify(toSave))
        setValue(toSave)
    }

    return {
        value: _value,
        save
    }
}
