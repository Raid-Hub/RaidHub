import { useEffect, useRef, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { CustomBungieSearchResult } from "../util/types"
import { asBungieName } from "../util/math"
import { NextRouter } from "next/router"

type UseSearch = {
    results: CustomBungieSearchResult[]
    isLoading: boolean
    doExactSearch(query: string, router: NextRouter): Promise<void>
    isPerformingExactSearch: boolean
}

export function useSearch(query: string): UseSearch {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isPerformingExactSearch, setIsPerformingExactSearch] = useState<boolean>(false)
    const lastSearch = useRef<number>(Date.now())
    const [results, setResults] = useState<CustomBungieSearchResult[]>([])

    const doExactSearch = async (query: string, router: NextRouter): Promise<void> => {
        setIsPerformingExactSearch(true)
        try {
            const bungieName = asBungieName(query)
            if (!bungieName) throw Error(`Unable to perform exact search with ${bungieName}`)
            const [user] = await client.searchByBungieName(...bungieName)
            await router.push(`/profile/${user.membershipType}/${user.membershipId}`)
            router.reload()
        } catch (e) {
            throw e
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

            let hydratedResponse: CustomBungieSearchResult[]
            if (bungieName) {
                const response = await client.searchByBungieName(...bungieName)
                hydratedResponse = await Promise.all(
                    response.filter(
                        user =>
                            !user.crossSaveOverride ||
                            user.membershipType === user.crossSaveOverride
                    )
                    //.map(async user => ({ ...user, ...(await client.getFirstCharacter(user)) }))
                )
            } else {
                const response = await client.searchForUser(query.split("#")[0])
                hydratedResponse = await Promise.all(
                    response
                        .map(user => ({
                            ...user,
                            ...user.destinyMemberships[0]
                        }))
                        .filter(user => user.membershipId && user.membershipType)
                    //.map(async user => ({ ...user, ...(await client.getFirstCharacter(user)) }))
                )
            }
            if (lastSearch.current === currentSearch) {
                setResults(hydratedResponse)
                setLoading(false)
            }
        }
    }, [query])
    return { results, isLoading, doExactSearch, isPerformingExactSearch }
}
