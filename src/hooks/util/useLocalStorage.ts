import { useEffect, useState } from "react"

export const useLocalStorage = <V>(
    key: string,
    defaultValue: V
): {
    value: V
    save: (value: V | ((old: V) => V)) => void
} => {
    const [_value, setValue] = useState<V>(defaultValue)

    useEffect(() => {
        const fromStore = localStorage.getItem(key)
        setValue(fromStore ? JSON.parse(fromStore) : defaultValue)
    }, [key, defaultValue])

    const save = (value: V | ((old: V) => V)) => {
        const toSave = typeof value === "function" ? (value as (old: V) => V)(_value) : value
        localStorage.setItem(key, JSON.stringify(toSave))
        setValue(toSave)
    }

    return {
        value: _value,
        save
    }
}
