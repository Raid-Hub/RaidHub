import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

export function useQueryParams<T extends Record<string, string>>() {
    const searchParams = useSearchParams()

    return useMemo(() => {
        const mutableParams = new URLSearchParams(searchParams)

        const replace = (params: URLSearchParams) =>
            window.history.pushState(null, "", `?${params.toString()}`)

        const get = <K extends keyof T & string>(key: K) => mutableParams.get(key) as T[K]

        const getAll = <K extends keyof T & string>(key: K) => mutableParams.getAll(key) as T[K][]

        const append = <K extends keyof T & string>(key: K, value: T[K]) => {
            mutableParams.append(key, value)
            replace(mutableParams)
        }
        const set = <K extends keyof T & string>(key: K, value: T[K]) => {
            mutableParams.set(key, value)
            replace(mutableParams)
        }
        const remove = <K extends keyof T & string>(key: K, value?: T[K]) => {
            mutableParams.delete(key, value)
            replace(mutableParams)
        }
        const update = <K extends keyof T & string>(key: K, updater: (old?: T[K]) => T[K]) => {
            mutableParams.set(key, updater(mutableParams.get(key) as T[K]))
            replace(mutableParams)
        }

        return { get, getAll, set, append, remove, replace, update }
    }, [searchParams])
}
