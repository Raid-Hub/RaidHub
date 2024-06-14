"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "~/components/Card"
import { Flex } from "~/components/layout/Flex"
import { useTimer } from "~/hooks/util/useTimer"
import { secondsToHMS } from "~/util/presentation/formatting"
import { useLocale } from "../layout/managers/LocaleManager"

export const ClientControls = ({ date }: { date: Date }) => {
    const [isRefreshDisabled, setIsRefreshDisabled] = useState(true)
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => setIsRefreshDisabled(false), 3000)
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
        startTimeMS: date.getTime(),
        interval: 1000
    })

    return (
        <Card>
            <Flex $align="flex-start" $padding={0.5}>
                <Timestamp title="Last Refresh" time={lastRefresh} />
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

const Timestamp = ({ title, time }: { title: string; time: Date }) => {
    const { locale } = useLocale()

    return (
        <Flex $direction="column" $align="flex-start" $padding={0} $gap={0.5}>
            <div>{title}</div>
            <time dateTime={time.toISOString()}>
                {time.toLocaleTimeString(locale, {
                    timeStyle: "medium"
                })}
            </time>
        </Flex>
    )
}
