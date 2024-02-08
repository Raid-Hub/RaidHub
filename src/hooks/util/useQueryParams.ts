import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useQueryParams<T extends { [key: string]: string }>() {
    const searchParams = useSearchParams()
    const path = usePathname()
    const router = useRouter()

    const mutableParams = new URLSearchParams(searchParams)

    const replace = (params: URLSearchParams) => router.replace(`${path}?${params}`)

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
        // @ts-ignore - typescript doesn't know that value exists
        mutableParams.delete(key, value)
        replace(mutableParams)
    }

    return { get, getAll, set, append, remove, replace }
}
