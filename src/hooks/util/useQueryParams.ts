import { useSearchParams } from "next/navigation"
import { useMemo, useRef } from "react"

export function useQueryParams<T extends Record<string, string>>() {
    const searchParams = useSearchParams()

    // This allows us to create a mutable URLSearchParams object
    const mutable = new URLSearchParams(searchParams)
    const mutableParams = useRef(mutable)
    mutableParams.current = mutable

    return useMemo(() => {
        const replace = (params: URLSearchParams) =>
            window.history.pushState(null, "", `?${params.toString()}`)

        const get = <K extends keyof T & string>(key: K) => mutableParams.current.get(key) as T[K]

        const getAll = <K extends keyof T & string>(key: K) =>
            mutableParams.current.getAll(key) as T[K][]

        const append = <K extends keyof T & string>(key: K, value: T[K]) => {
            mutableParams.current.append(key, value)
            replace(mutableParams.current)
        }
        const set = <K extends keyof T & string>(key: K, value: T[K]) => {
            mutableParams.current.set(key, value)
            replace(mutableParams.current)
        }
        const setMany = <V extends ParamTuple<T, keyof T & string>>(values: V[]) => {
            values.forEach(([key, value]) => {
                mutableParams.current.set(key, value)
            })
            replace(mutableParams.current)
        }
        const remove = <K extends keyof T & string>(key: K, value?: T[K]) => {
            mutableParams.current.delete(key, value)
            replace(mutableParams.current)
        }
        const update = <K extends keyof T & string>(key: K, updater: (old?: T[K]) => T[K]) => {
            mutableParams.current.set(key, updater(mutableParams.current.get(key) as T[K]))
            replace(mutableParams.current)
        }

        return { get, getAll, set, setMany, append, remove, replace, update }
    }, [mutableParams])
}

type ParamTuple<T extends Record<string, string>, K extends keyof T & string> = [
    key: K,
    value: T[K]
]
