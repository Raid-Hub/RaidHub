"use client"

import { useQueryClient, type QueryKey } from "@tanstack/react-query"
import { Suspense } from "react"
import { Panel } from "~/components/Panel"
import NextArrow from "~/components/icons/NextArrow"
import PreviousArrow from "~/components/icons/PreviousArrow"
import ReloadArrow from "~/components/icons/ReloadArrow"
import { Flex } from "~/components/layout/Flex"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import { usePage } from "./usePage"

type Props = {
    queryKey: readonly [...QueryKey, page: number]
}

// Required because of the use of useSearchParams
export const StaticLeaderboardControls = (props: Props) => (
    <Suspense fallback={<></>}>
        <ClientRenderedLeaderboardControls {...props} />
    </Suspense>
)

const ClientRenderedLeaderboardControls = (props: Props) => {
    const { set } = useQueryParams<{
        page: string
    }>()
    const currentPage = usePage()
    const queryKey = Array.from(props.queryKey)
    queryKey[props.queryKey.length - 1] = currentPage

    const queryClient = useQueryClient()
    const canGoForward = true
    const canGoBack = currentPage > 1

    const handleForwards = () => {
        set("page", String(currentPage + 1))
    }

    const handleBackwards = () => {
        set("page", String(Math.max(1, currentPage - 1)))
    }

    return (
        <Panel style={{ alignSelf: "flex-end" }}>
            <Flex $padding={0}>
                <ReloadArrow
                    sx={25}
                    color="white"
                    hoverColor="orange"
                    pointer
                    onClick={() => queryClient.refetchQueries(queryKey)}
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
            </Flex>
        </Panel>
    )
}
