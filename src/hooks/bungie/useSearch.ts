import { useCallback, useEffect, useRef, useState } from "react"
import { CustomBungieSearchResult, ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { searchForUsername } from "../../services/bungie/searchForUsername"
import { searchForBungieName } from "../../services/bungie/searchForBungieName"
import BungieName from "../../models/BungieName"
import { useBungieClient } from "../../components/app/TokenManager"

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

    const doExactSearch = async (query: string): Promise<void> => {
        setIsPerformingExactSearch(true)
        try {
            try {
                const bungieName = BungieName.parse(query)
                const { membershipType, membershipId } = await searchForBungieName({
                    displayName: bungieName.name,
                    displayNameCode: bungieName.code,
                    client
                })

                window.location.href = `/profile/${membershipType}/${membershipId}`
            } catch {
                throw Error(`Unable to perform exact search with ${query}`)
            }
        } catch (e) {
            CustomError.handle(errorHandler, e, ErrorCode.ExactSearch)
        } finally {
            setIsPerformingExactSearch(false)
        }
    }

    const fetchUsers = useCallback(async () => {
        const currentSearch = Date.now()
        lastSearch.current = currentSearch

        let bungieName: BungieName | undefined
        try {
            bungieName = BungieName.parse(query)
        } catch {
            bungieName = undefined
        }
        const searches: [
            general: Promise<CustomBungieSearchResult[]>,
            exact: Promise<CustomBungieSearchResult | undefined> | null
        ] = [
            searchForUsername({ displayNamePrefix: query.split("#")[0], pages: 1, client }).then(
                response =>
                    response
                        .map(user => ({
                            ...user,
                            ...user.destinyMemberships[0]
                        }))
                        .filter(user => user.membershipId && user.membershipType)
            ),
            bungieName
                ? searchForBungieName({
                      displayName: bungieName.name,
                      displayNameCode: bungieName.code,
                      client
                  })
                : null
        ]

        const [general, exact] = await Promise.all(searches)

        const results =
            bungieName !== undefined
                ? exact
                    ? [exact]
                    : general.filter(
                          result =>
                              result.bungieGlobalDisplayNameCode &&
                              new BungieName(
                                  result.bungieGlobalDisplayName,
                                  result.bungieGlobalDisplayNameCode
                              )
                                  .toString()
                                  .startsWith(`${bungieName!.toString()}`)
                      )
                : general

        if (lastSearch.current === currentSearch) {
            setResults(results)
            setLoading(false)
        }
    }, [client, query])

    useEffect(() => {
        setLoading(!!query)
        if (query) {
            fetchUsers()
        } else {
            setResults([])
        }
    }, [query, fetchUsers])

    return {
        results,
        isLoading,
        doExactSearch,
        isPerformingExactSearch
    }
}
