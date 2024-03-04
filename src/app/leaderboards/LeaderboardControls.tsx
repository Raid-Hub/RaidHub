"use client"

import { useQueryClient, type QueryKey } from "@tanstack/react-query"
import { Panel } from "~/components/Panel"
import NextArrow from "~/components/icons/NextArrow"
import PreviousArrow from "~/components/icons/PreviousArrow"
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
        queryKey: QueryKey
    } & (
        | {
              hasPages: true
              type: RaidHubLeaderboardSearchQueryType
              category: RaidHubLeaderboardSearchQueryCategory
              raid?: ListedRaid
          }
        | { hasPages: false }
    )
) => {
    const { set, remove } = useQueryParams<{
        page: string
        position: string
    }>()
    const currentPage = usePage()
    const { count } = usePageProps<PageProps>()
    const queryKey = Array.from(props.queryKey)
    if (props.hasPages) queryKey[props.queryKey.length - 1] = currentPage

    const queryClient = useQueryClient()
    const canGoForward = true
    const canGoBack = currentPage > 1

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
            {props.hasPages && (
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
