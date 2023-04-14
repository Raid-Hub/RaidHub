import { useEffect, useRef, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { CustomBungieSearchResult } from "../util/types"

type UseSearch = {
    results: CustomBungieSearchResult[]
    isLoading: boolean
}

export function useSearch(query: string): UseSearch {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [results, setResults] = useState<CustomBungieSearchResult[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const bungieName = asBungieName(query)
            if (bungieName) {
                const response = await client.searchByBungieName(...bungieName)
                setResults(
                    response
                        .filter(
                            user =>
                                !user.crossSaveOverride ||
                                user.membershipType === user.crossSaveOverride
                        )
                        .map(user => ({
                            ...user
                        }))
                )
            } else {
                const response = await client.searchForUser(query.split("#")[0])
                setResults(
                    response.map(user => ({
                        ...user,
                        ...user.destinyMemberships[0]
                    }))
                )
            }
            setLoading(false)
        }

        if (query) {
            setLoading(true)
            fetchUsers()
        } else {
            setLoading(false)
            setResults([])
        }
    }, [query])
    return { results, isLoading }
}

function asBungieName(name: string): [name: string, code: number] | undefined {
    if (name.includes("#")) {
        const [nameStr, code] = name.split("#")
        let codeNum = parseInt(code)
        if (nameStr && codeNum) {
            return [nameStr, codeNum]
        }
    }
    return undefined
}
