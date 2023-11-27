import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"

/*
 This is deprecated, use useSearchParams instead
 */
export function useQueryParamState<T = ParsedUrlQuery[string]>(
    key: string,
    opts?: {
        decoder?: (value: ParsedUrlQuery[string]) => T | undefined
        encoder?: (value: T) => string | number | boolean
    }
) {
    const router = useRouter()

    function clear() {
        const q = router.query
        delete q[key]
        router.push(
            {
                query: q
            },
            undefined,
            { shallow: true }
        )
    }

    function set(value: T) {
        router.push(
            {
                query: {
                    ...router.query,
                    [key]: encodeURIComponent(
                        (opts?.encoder ? opts.encoder(value) : value) as string | number | boolean
                    )
                }
            },
            undefined,
            { shallow: true }
        )
    }

    const rawValue = router.query[key]
    const value = (opts?.decoder ? opts.decoder(rawValue) : rawValue) as T | undefined

    return {
        value,
        clear,
        set
    }
}
