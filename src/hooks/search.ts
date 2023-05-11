import { useEffect, useRef, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { CustomBungieSearchResult, ErrorHandler } from "../util/types"
import { asBungieName, fixBungieCode } from "../util/formatting"
import CustomError, { ErrorCode } from "../models/errors/CustomError"
import { error } from "console"

type UseSearchProps = {
    query: string
    errorHandler: ErrorHandler
}
type UseSearch = {
    results: CustomBungieSearchResult[]
    isLoading: boolean
    doExactSearch(query: string): Promise<void>
    isPerformingExactSearch: boolean
}

export function useSearch({ query, errorHandler }: UseSearchProps): UseSearch {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isPerformingExactSearch, setIsPerformingExactSearch] = useState<boolean>(false)
    const lastSearch = useRef<number>(Date.now())
    const [results, setResults] = useState<CustomBungieSearchResult[]>([])

    const doExactSearch = async (query: string): Promise<void> => {
        setIsPerformingExactSearch(true)
        try {
            const bungieName = asBungieName(query)
            if (!bungieName) throw Error(`Unable to perform exact search with ${bungieName}`)
            const { membershipType, membershipId } = await client.searchByBungieName(...bungieName)
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
                client.searchForUser(query.split("#")[0]).then(response =>
                    response
                        .map(user => ({
                            ...user,
                            ...user.destinyMemberships[0]
                        }))
                        .filter(user => user.membershipId && user.membershipType)
                ),
                bungieName ? client.searchByBungieName(...bungieName) : null
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
    }, [query])
    return { results, isLoading, doExactSearch, isPerformingExactSearch }
}
