"use client"

import { QueryObserver, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Panel } from "~/components/Panel"
import NextArrow from "~/components/icons/NextArrow"
import PreviousArrow from "~/components/icons/PreviousArrow"
import PreviousArrowSkip from "~/components/icons/PreviousArrowSkip"
import ReloadArrow from "~/components/icons/ReloadArrow"
import { Flex } from "~/components/layout/Flex"
import { usePageProps } from "~/components/layout/PageWrapper"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import type {
    ListedRaid,
    RaidHubLeaderboardSearchQueryCategory,
    RaidHubLeaderboardSearchQueryType
} from "~/services/raidhub/types"
import { type PageProps } from "./Leaderboard"
import { LeaderboardSearch } from "./LeaderboardSearch"
import { usePage } from "./usePage"

export const LeaderboardControls = (
    props: {
        refreshQueryKey: QueryKey
        hasPages: boolean
    } & (
        | {
              hasSearch: true
              type: RaidHubLeaderboardSearchQueryType
              category: RaidHubLeaderboardSearchQueryCategory
              raid?: ListedRaid
          }
        | { hasSearch: false }
    )
) => {
    const { set, remove } = useQueryParams<{
        page: string
        position: string
    }>()
    const currentPage = usePage()
    const { count } = usePageProps<PageProps>()
    const queryKey = Array.from(props.refreshQueryKey)
    if (props.hasPages) queryKey[props.refreshQueryKey.length - 1] = currentPage

    const queryClient = useQueryClient()
    const canGoBack = currentPage > 1
    const isFirstPage = currentPage === 1
    const [canGoForward, setCanGoForward] = useState(props.hasPages)

    useEffect(() => {
        const observer = new QueryObserver<{ entries: unknown[] }>(queryClient, {
            queryKey: queryKey
        })

        return observer.subscribe(result => {
            setCanGoForward(props.hasPages && result.data?.entries.length === count)
        })
    }, [props.hasPages, queryKey, queryClient, count])

    const handleGoToFirstPage = () => {
        set("page", "1", {
            commit: true,
            shallow: false
        })
    }

    const handleForwards = () => {
        remove("position", undefined, {
            commit: false
        })
        set("page", String(currentPage + 1), {
            commit: true,
            shallow: false
        })
    }

    const handleBackwards = () => {
        remove("position", undefined, {
            commit: false
        })
        set("page", String(Math.max(1, currentPage - 1)), {
            commit: true,
            shallow: false
        })
    }

    return (
        <>
            {props.hasSearch && (
                <LeaderboardSearch
                    type={props.type}
                    category={props.category}
                    raid={props.raid}
                    count={count}
                    resultQueryKey={queryKey}
                />
            )}
            <Panel>
                <Flex $padding={0}>
                    <ReloadArrow
                        sx={25}
                        color="white"
                        hoverColor="orange"
                        pointer
                        onClick={() => queryClient.refetchQueries(queryKey)}
                    />
                    {props.hasPages && (
                        <>
                            <PreviousArrowSkip
                                sx={20}
                                color={!isFirstPage ? "white" : "gray"}
                                hoverColor="orange"
                                pointer
                                aria-disabled={isFirstPage}
                                onClick={!isFirstPage ? handleGoToFirstPage : undefined}
                            />
                            <PreviousArrow
                                sx={20}
                                color={canGoBack ? "white" : "gray"}
                                hoverColor="orange"
                                pointer
                                aria-disabled={!canGoBack}
                                onClick={canGoBack ? handleBackwards : undefined}
                            />
                            <NextArrow
                                sx={20}
                                color={canGoForward ? "white" : "gray"}
                                hoverColor="orange"
                                pointer
                                aria-disabled={!canGoForward}
                                onClick={canGoForward ? handleForwards : undefined}
                            />
                        </>
                    )}
                </Flex>
            </Panel>
        </>
    )
}
