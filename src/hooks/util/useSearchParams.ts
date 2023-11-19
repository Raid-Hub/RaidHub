import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useRef, useState } from "react"

export function useSearchParams<T>({ decoder }: { decoder: (query: ParsedUrlQuery) => T }) {
    const searchParams = useRef(new URLSearchParams())
    const [isReady, setIsReady] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (router.isReady) {
            searchParams.current = new URLSearchParams()
            for (const [key, value] of Object.entries(router.query)) {
                if (Array.isArray(value)) {
                    for (const v of value) {
                        searchParams.current.append(key, v)
                    }
                } else if (value !== undefined) {
                    searchParams.current.append(key, value)
                }
            }
            setIsReady(true)
        } else {
            setIsReady(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady])

    const push = () =>
        router.replace({ query: searchParams.current.toString() }, undefined, { shallow: true })

    const append = (key: string, value: string) => {
        searchParams.current.append(key, value)
        push()
    }
    const set = (key: string, value: string) => {
        searchParams.current.set(key, value)
        push()
    }
    const remove = (key: string, value?: string) => {
        // @ts-ignore for some reason the type definition doesn't include the second argument
        searchParams.current.delete(key, value)
        push()
    }

    const replaceAll = (params: URLSearchParams) => {
        searchParams.current = params
        push()
    }

    if (isReady) {
        try {
            const query = decoder(router.query)
            return {
                isReady: true as const,
                query,
                searchString: searchParams.current.toString(),
                set,
                append,
                remove,
                replaceAll
            }
        } catch (e) {
            // if something went wrong we can just reset the search params
            console.error(e)
            searchParams.current = new URLSearchParams()
            push()
            return { isReady: false as const }
        }
    } else {
        return { isReady: false as const }
    }
}
