import { useCallback, useEffect, useRef, useState } from "react"
import { CustomBungieSearchResult, ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { searchForUsername } from "../../services/bungie/searchForUsername"
import { searchForBungieName } from "../../services/bungie/searchForBungieName"
import BungieName from "../../models/BungieName"
import { useBungieClient } from "../../components/app/TokenManager"
import { wait } from "../../util/wait"
import { useRouter } from "next/router"
import { isPrimaryCrossSave } from "../../util/destiny/crossSave"

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
    const [enteredText, setEnteredText] = useState("")
    const nextQuery = useRef("")
    const [activeQuery, setActiveQuery] = useState("")
    const lastSearch = useRef<number>(Date.now())
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isPerformingExactSearch, setIsPerformingExactSearch] = useState<boolean>(false)
    const [results, setResults] = useState<CustomBungieSearchResult[]>([])
    const [error, setError] = useState<Error | null>(null)

    const router = useRouter()

    const client = useBungieClient()

    const clearQuery = useCallback(() => {
        setActiveQuery("")
        nextQuery.current = ""
        setTimeout(() => setEnteredText(""), 200)
    }, [])

    const doExactSearch = useCallback(
        async (query: string): Promise<void> => {
            setIsPerformingExactSearch(true)

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
            } catch (e: any) {
                if (e.ErrorCode !== 217) {
                    throw e
                }
            } finally {
                setIsPerformingExactSearch(false)
            }
        },
        [client, router]
    )

    const fetchUsers = useCallback(async () => {
        const currentSearch = Date.now()
        lastSearch.current = currentSearch

        let bungieName: BungieName | undefined
        try {
            bungieName = BungieName.parse(activeQuery)
        } catch {
            bungieName = undefined
        }

        try {
            const searches: [
                general: Promise<CustomBungieSearchResult[]>,
                exact: Promise<CustomBungieSearchResult | undefined> | null
            ] = [
                searchForUsername({
                    displayNamePrefix: activeQuery.split("#")[0],
                    pages: 4,
                    client
                }).then(
                    response =>
                        response
                            .map(({ destinyMemberships }) =>
                                destinyMemberships.find(d2m => isPrimaryCrossSave(d2m))
                            )
                            .filter(
                                user => user && user.membershipId && user.membershipType
                            ) as CustomBungieSearchResult[]
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
                setResults(rawResults)
                setLoading(false)
            }
        } catch (e: any) {
            setError(e)
            setLoading(false)
        }
    }, [client, activeQuery])

    useEffect(() => {
        error && CustomError.handle(errorHandler, error, ErrorCode.Search)
    }, [error, errorHandler])

    const debounceQuery = useCallback(
        async (potentialQuery: string) => {
            await wait(DEBOUNCE)
            if (!isPerformingExactSearch && potentialQuery === nextQuery.current) {
                setActiveQuery(potentialQuery)
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
                setActiveQuery(enteredText)
            }
        },
        [doExactSearch, enteredText, clearQuery, onSuccessfulExactSearch]
    )

    useEffect(() => {
        setLoading(!!activeQuery)
        if (activeQuery) {
            fetchUsers()
        } else {
            setResults([])
        }
    }, [activeQuery, fetchUsers])

    return {
        enteredText,
        results: filterResults(results, enteredText),
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
