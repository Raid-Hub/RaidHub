import { useCallback, useEffect, useRef, useState } from "react"
import { CustomBungieSearchResult, ErrorHandler } from "../../types/types"
import { asBungieName, fixBungieCode } from "../../util/presentation/formatting"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"

type UseSearchParams = {
    query: string
    errorHandler: ErrorHandler
}
type UseSearch = {
    results: CustomBungieSearchResult[]
    isLoading: boolean
    doExactSearch(query: string): Promise<void>
    isPerformingExactSearch: boolean
}

export function useSearch({ query, errorHandler }: UseSearchParams): UseSearch {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isPerformingExactSearch, setIsPerformingExactSearch] = useState<boolean>(false)
    const lastSearch = useRef<number>(Date.now())
    const [results, setResults] = useState<CustomBungieSearchResult[]>([])
    const client = useBungieClient()

    const searchByBungieName = useCallback(
        async (bungieName: [name: string, code: number]) => {
            return client.searchByBungieName(...bungieName)
        },
        [client]
    )

    const searchForUser = useCallback(
        async (username: string) => {
            return client.searchForUser(username)
        },
        [client]
    )

    const doExactSearch = async (query: string): Promise<void> => {
        setIsPerformingExactSearch(true)
        try {
            const bungieName = asBungieName(query)
            if (!bungieName) throw Error(`Unable to perform exact search with ${bungieName}`)
            const { membershipType, membershipId } = await searchByBungieName(bungieName)
            window.location.href = `/profile/${membershipType}/${membershipId}`
        } catch (e) {
            CustomError.handle(errorHandler, e, ErrorCode.ExactSearch)
        } finally {
            setIsPerformingExactSearch(false)
        }
    }

    useEffect(() => {
        setLoading(!!query)
        if (query) {
            fetchUsers()
        } else {
            setResults([])
        }

        async function fetchUsers() {
            const currentSearch = Date.now()
            lastSearch.current = currentSearch

            const bungieName = asBungieName(query)
            const searches: [
                general: Promise<CustomBungieSearchResult[]>,
                exact: Promise<CustomBungieSearchResult | undefined> | null
            ] = [
                searchForUser(query.split("#")[0]).then(response =>
                    response
                        .map(user => ({
                            ...user,
                            ...user.destinyMemberships[0]
                        }))
                        .filter(user => user.membershipId && user.membershipType)
                ),
                bungieName ? searchByBungieName(bungieName) : null
            ]

            const [general, exact] = await Promise.all(searches)

            const results = bungieName
                ? exact
                    ? [exact]
                    : general.filter(
                          result =>
                              result.bungieGlobalDisplayNameCode &&
                              fixBungieCode(result.bungieGlobalDisplayNameCode).startsWith(
                                  `${bungieName[1]}`
                              )
                      )
                : general

            if (lastSearch.current === currentSearch) {
                setResults(results)
                setLoading(false)
            }
        }
    }, [query, searchByBungieName, searchForUser])
    return {
        results,
        isLoading,
        doExactSearch,
        isPerformingExactSearch
    }
}
