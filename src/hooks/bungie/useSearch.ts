import { useCallback, useEffect, useRef, useState } from "react"
import { CustomBungieSearchResult, ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { searchForUsername } from "../../services/bungie/searchForUsername"
import { searchForBungieName } from "../../services/bungie/searchForBungieName"
import BungieName from "../../models/BungieName"
import { useBungieClient } from "../../components/app/TokenManager"
import { wait } from "../../util/wait"
import { useRouter } from "next/router"

const DEBOUNCE = 250

export const useSearch = ({
    errorHandler,
    onSuccessfulExactSearch
}: {
    errorHandler: ErrorHandler
    onSuccessfulExactSearch(): void
}): {
    enteredText: string
    results: (CustomBungieSearchResult & { name: string })[]
    isLoading: boolean
    isPerformingExactSearch: boolean
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void
    handleFormEnter(event: React.FormEvent<HTMLFormElement>): void
    clearQuery(): void
} => {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isPerformingExactSearch, setIsPerformingExactSearch] = useState<boolean>(false)
    const [enteredText, setEnteredText] = useState("")
    const nextQuery = useRef("")
    const [query, setQuery] = useState("")
    const lastSearch = useRef<number>(Date.now())
    const [results, setResults] = useState<(CustomBungieSearchResult & { name: string })[]>([])
    const router = useRouter()

    const client = useBungieClient()

    const clearQuery = useCallback(() => {
        setQuery("")
        nextQuery.current = ""
        setTimeout(() => setEnteredText(""), 200)
    }, [])

    const doExactSearch = useCallback(
        async (query: string): Promise<void> => {
            setIsPerformingExactSearch(true)
            try {
                try {
                    const bungieName = BungieName.parse(query)
                    const { membershipType, membershipId } = await searchForBungieName({
                        displayName: bungieName.name,
                        displayNameCode: bungieName.code,
                        client
                    })

                    router.push(
                        "/profile/[platform]/[membershipId]",
                        `/profile/${membershipType}/${membershipId}`
                    )
                } catch (e) {
                    throw Error(`Unable to perform exact search with ${query}`)
                }
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.ExactSearch)
            } finally {
                setIsPerformingExactSearch(false)
            }
        },
        [client, errorHandler, onSuccessfulExactSearch, clearQuery, router]
    )

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

        const rawResults = bungieName !== undefined ? (exact ? [exact] : general) : general

        if (lastSearch.current === currentSearch) {
            setResults(() => filterResults(rawResults, enteredText))
            setLoading(false)
        }
    }, [enteredText, client, query])

    const debounceQuery = useCallback(
        async (potentialQuery: string) => {
            await wait(DEBOUNCE)
            if (!isPerformingExactSearch && potentialQuery === nextQuery.current) {
                setQuery(potentialQuery)
            }
        },
        [isPerformingExactSearch]
    )

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newQuery = event.target.value
            setEnteredText(newQuery)
            nextQuery.current = newQuery
            debounceQuery(newQuery)
        },
        [debounceQuery]
    )

    const handleFormEnter = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            try {
                await doExactSearch(enteredText)

                clearQuery()
                onSuccessfulExactSearch()
            } catch (e: any) {
                nextQuery.current = enteredText
                setQuery(enteredText)
            }
        },
        [doExactSearch, enteredText]
    )

    useEffect(() => {
        setLoading(!!query)
        if (query) {
            fetchUsers()
        } else {
            setResults([])
        }
    }, [query, fetchUsers])

    return {
        enteredText,
        results,
        isLoading,
        isPerformingExactSearch,
        handleInputChange,
        handleFormEnter,
        clearQuery
    }
}

function filterResults(
    results: CustomBungieSearchResult[],
    str: string
): (CustomBungieSearchResult & { name: string })[] {
    const all = results.map(result => {
        let name = result.displayName
        if (result.bungieGlobalDisplayName && result.bungieGlobalDisplayNameCode)
            try {
                name = new BungieName(
                    result.bungieGlobalDisplayName,
                    result.bungieGlobalDisplayNameCode
                ).toString()
            } catch {}
        return {
            ...result,
            name
        }
    })
    if (all.length > 10) {
        return all.filter(({ name }) => name.startsWith(str))
    } else {
        return all.filter(({ name }) => name.includes(str))
    }
}
