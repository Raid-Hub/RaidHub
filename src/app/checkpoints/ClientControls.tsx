"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "~/components/Card"
import { Flex } from "~/components/layout/Flex"
import { useTimer } from "~/hooks/util/useTimer"
import { formattedTimeSince, secondsToHMS } from "~/util/presentation/formatting"
import { useLocale } from "../layout/wrappers/LocaleManager"

export const ClientControls = ({ date }: { date: Date }) => {
    const { locale } = useLocale()
    const [isRefreshDisabled, setIsRefreshDisabled] = useState(true)
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => setIsRefreshDisabled(false), 2000)
    }, [])

    // This "query" is used to trigger a refresh of the data
    const { refetch, data: lastRefresh } = useQuery({
        queryKey: ["d2cp", "refresh"],
        initialData: () => date,
        initialDataUpdatedAt: () => date.getTime(),
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
        staleTime: 60000,
        refetchInterval: 60000,
        queryFn: () => {
            if (isRefreshDisabled) return date

            router.refresh()
            setIsRefreshDisabled(true)
            setTimeout(() => setIsRefreshDisabled(false), 1000)
            return new Date()
        }
    })

    const elapsed = useTimer({
        since: date
    })

    return (
        <Card style={{ minWidth: "min(50%, 350px)" }}>
            <Flex $align="space-between" $padding={0.5}>
                <Flex $direction="column" $align="flex-start" $padding={0} $gap={0.5}>
                    <div>Last Refresh</div>
                    <div>{formattedTimeSince(lastRefresh, locale)}</div>
                </Flex>
                <Flex $direction="column" $align="flex-start" $padding={0} $gap={0.5}>
                    <div>Stale Time</div>
                    <div>{secondsToHMS(elapsed / 1000, false)}</div>
                </Flex>
                <button disabled={isRefreshDisabled} onClick={() => refetch()}>
                    Refresh
                </button>
            </Flex>
        </Card>
    )
}
