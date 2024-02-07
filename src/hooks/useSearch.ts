"use client"

import { UserInfoCard, UserSearchResponseDetail } from "bungie-net-core/models"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { useDestinyPlayerByBungieName } from "~/services/bungie/useDestinyPlayerByBungieName"
import { useSearchByGlobalName } from "~/services/bungie/useSearchByGlobalName"
import { RaidHubPlayerSearchResult } from "~/types/raidhub-api"
import { getUserName } from "~/util/destiny/bungieName"
import { useRaidHubPlayerSearch } from "../services/raidhub/useRaidHubPlayerSearch"
import { useDebounce } from "./util/useDebounce"

export function useSearch(props?: {
    onRedirect?: (result: RaidHubPlayerSearchResult) => void
    navigateOnEnter?: boolean
}) {
    const router = useRouter()

    const [enteredText, setEnteredText] = useState("")
    const [enterPressed, setEnterPressed] = useState(false)
    const [debouncedQuery, forceUpdateQuery] = useDebounce(enteredText, 250)

    const raidHubSearchQuery = useRaidHubPlayerSearch(debouncedQuery)
    /**
     * if the raidhub search is done and no results are found,
     * or the  raidhub search errored, we should use the bungie search
     * */
    const shouldUseBungieSearch =
        !raidHubSearchQuery.isFetching &&
        (raidHubSearchQuery.data?.length === 0 || raidHubSearchQuery.isError)
    const exactGlobalName = useMemo(() => debouncedQuery.split("#"), [debouncedQuery])
    const bungieDisplayNamePrefixQuery = useSearchByGlobalName(
        { displayNamePrefix: exactGlobalName[0] },
        {
            enabled: shouldUseBungieSearch && exactGlobalName.length === 1
        }
    )
    const bungieExactGlobalNameQuery = useDestinyPlayerByBungieName(
        {
            displayName: exactGlobalName[0],
            displayNameCode: Number(exactGlobalName[1]?.substring(0, 4))
        },
        {
            enabled: shouldUseBungieSearch && exactGlobalName.length === 2
        }
    )

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value
        setEnteredText(newQuery)
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        forceUpdateQuery(enteredText)
        setEnterPressed(true)
    }

    /**
     * Redirect if only one result is found and the user has pressed enter
     */
    if (
        enterPressed &&
        props?.navigateOnEnter &&
        !raidHubSearchQuery.isStale &&
        raidHubSearchQuery.isSuccess &&
        raidHubSearchQuery.data.length === 1
    ) {
        const result = raidHubSearchQuery.data[0]
        setEnterPressed(false)
        props.onRedirect?.(result)
        router.push(`/profile/${result.membershipType}/${result.membershipId}`)
    }

    const filteredResults = [
        ...(raidHubSearchQuery.data ?? []),
        ...((bungieExactGlobalNameQuery.data ?? []) as UserInfoCard[]).map(
            mapUserInfoCardToSearchResult
        ),
        ...((bungieDisplayNamePrefixQuery.data ?? []) as UserSearchResponseDetail[]).map(res =>
            mapUserInfoCardToSearchResult(res.destinyMemberships[0])
        )
    ].filter(r => getUserName(r).toLowerCase().includes(enteredText.toLowerCase()))

    const clearQuery = useCallback(() => {
        setEnteredText("")
        forceUpdateQuery("")
    }, [])

    return {
        enteredText,
        results: filteredResults,
        handleInputChange,
        handleFormSubmit,
        clearQuery,
        isLoading:
            raidHubSearchQuery.isFetching ||
            bungieExactGlobalNameQuery.isFetching ||
            bungieDisplayNamePrefixQuery.isFetching
    }
}

function mapUserInfoCardToSearchResult(res: UserInfoCard): RaidHubPlayerSearchResult {
    return {
        membershipId: res.membershipId,
        membershipType: res.membershipType,
        iconPath: res.iconPath,
        displayName: res.displayName,
        lastSeen: "",
        clears: 0,
        ...(res.bungieGlobalDisplayNameCode
            ? {
                  bungieGlobalDisplayName: res.bungieGlobalDisplayName,
                  bungieGlobalDisplayNameCode: String(res.bungieGlobalDisplayNameCode).padStart(
                      4,
                      "0"
                  )
              }
            : {
                  bungieGlobalDisplayName: null,
                  bungieGlobalDisplayNameCode: null
              })
    }
}
