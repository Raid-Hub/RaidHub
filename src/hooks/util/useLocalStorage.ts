import { useEffect, useState } from "react"

export const useLocalStorage = <V>(
    key: string,
    defaultValue: V
): [V, (value: V | ((old: V) => V)) => void] => {
    const [_value, setValue] = useState<V>(defaultValue)

    useEffect(() => {
        const fromStore = localStorage.getItem(key)
        setValue(fromStore ? (JSON.parse(fromStore) as V) : defaultValue)
    }, [key, defaultValue])

    const save = (value: V | ((old: V) => V)) => {
        const toSave = typeof value === "function" ? (value as (old: V) => V)(_value) : value
        localStorage.setItem(key, JSON.stringify(toSave))
        setValue(toSave)
    }

    return [_value, save]
}

export const useLocalStorageObject = <V>(args: {
    storageKey: string
    paramKey: string
    defaultValue: V
}): [V, (value: V | ((old: V) => V)) => void] => {
    const [_value, setValue] = useState<V>(args.defaultValue)

    useEffect(() => {
        const fromStore = localStorage.getItem(args.storageKey)
        const parsed = fromStore ? (JSON.parse(fromStore) as Record<string, V>) : {}
        if (args.paramKey in parsed) {
            setValue(fromStore ? parsed[args.paramKey] : args.defaultValue)
        }
    }, [args.paramKey, args.storageKey, args.defaultValue])

    const save = (value: V | ((old: V) => V)) => {
        const toSave = typeof value === "function" ? (value as (old: V) => V)(_value) : value
        const currStore = localStorage.getItem(args.storageKey)
        localStorage.setItem(
            args.storageKey,
            JSON.stringify({
                ...(currStore ? JSON.parse(currStore) : {}),
                [args.paramKey]: toSave
            })
        )
        setValue(toSave)
    }

    return [_value, save]
}
