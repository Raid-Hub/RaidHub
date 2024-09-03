import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { type z } from "zod"
import { useMutableReference } from "./useMutableReference"

type CommitArgs =
    | {
          commit: true
          shallow: boolean
      }
    | {
          commit: false
      }
const defaultArgs: CommitArgs = {
    commit: true,
    shallow: true
}

/**
 * Custom hook for managing query parameters in a URL.
 * By default, changes are commited to the window. However, you can override
 * this behavior by passing `{ commit: false }` to the mutating method.
 * You can also override the pushState behavior by passing `{ shallow: false }` to make the
 * Changes alter the browser history.
 *
 * @template T - The type of the query parameters object.
 * @returns An object with methods for manipulating query parameters.
 */
export function useQueryParams<
    T extends Record<string, string>,
    S extends { [K in keyof T]: z.ZodType<T[K]> }
>(validator?: z.ZodObject<S, z.UnknownKeysParam, z.ZodTypeAny, T, T>) {
    const _readonlyParams = useSearchParams()
    const validatedSearchParams = new URLSearchParams(
        Array.from(_readonlyParams).filter(([k, v]) => {
            if (!validator) return true
            return (
                validator.shape[k]?.safeParse(v).success ??
                validator._def.unknownKeys === "passthrough"
            )
        })
    )
    const mutableParams = useMutableReference(validatedSearchParams)

    const immutableActions = useMemo(() => {
        const clear = () =>
            mutableParams.current.forEach((_, key) => mutableParams.current.delete(key))

        const replace = (params?: URLSearchParams, shallow?: boolean) =>
            window.history[shallow ? "replaceState" : "pushState"](
                null,
                "",
                params ? `?${params.toString()}` : undefined
            )

        const commit = (shallow?: boolean) => replace(mutableParams.current, shallow)

        const get = <K extends keyof T & string, D extends T[K] | undefined>(
            key: K,
            def?: D
        ): D extends T[K] ? T[K] : T[K] | undefined => {
            const value = mutableParams.current.get(key) as T[K] | undefined
            return value ?? (def as D extends T[K] ? T[K] : T[K] | undefined)
        }

        const getAll = <K extends keyof T & string>(key: K) => {
            return mutableParams.current.getAll(key) as T[K][]
        }

        const append = <K extends keyof T & string>(
            key: K,
            value: T[K],
            args: CommitArgs = defaultArgs
        ) => {
            mutableParams.current.append(key, value)
            if (args.commit) {
                commit(args.shallow)
            }
        }

        const set = <K extends keyof T & string>(
            key: K,
            value: T[K],
            args: CommitArgs = defaultArgs
        ) => {
            mutableParams.current.set(key, value)
            if (args.commit) {
                commit(args.shallow)
            }
        }
        const remove = <K extends keyof T & string>(
            key: K,
            value?: T[K],
            args: CommitArgs = defaultArgs
        ) => {
            mutableParams.current.delete(key, value)
            if (args.commit) {
                commit(args.shallow)
            }
        }
        const update = <K extends keyof T & string>(
            key: K,
            updater: (old?: T[K]) => { value: T[K]; args?: CommitArgs }
        ) => {
            const { args = defaultArgs, value } = updater(mutableParams.current.get(key) as T[K])
            mutableParams.current.set(key, value)
            if (args.commit) {
                commit(args.shallow)
            }
        }

        return {
            get,
            getAll,
            set,
            append,
            remove,
            update,
            replace,
            commit,
            clear
        }
    }, [mutableParams])

    return {
        validatedSearchParams,
        ...immutableActions
    }
}
