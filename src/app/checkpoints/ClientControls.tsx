"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Card } from "~/components/Card"
import { Flex } from "~/components/layout/Flex"
import { useInterval } from "~/hooks/util/useInterval"
import { useLocale } from "../layout/wrappers/LocaleManager"

export const ClientControls = ({ refreshedAt }: { refreshedAt: Date }) => {
    const { locale } = useLocale()
    const [isRefreshDisabled, setIsRefreshDisabled] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => setIsRefreshDisabled(false), 2000)
        return () => clearTimeout(timer)
    }, [])

    const refetch = useCallback(() => {
        router.refresh()
        setIsRefreshDisabled(true)
        setTimeout(() => setIsRefreshDisabled(false), 1000)
    }, [router])

    useInterval(30000, refetch)

    return (
        <Card>
            <Flex $align="space-between" $padding={0.5}>
                <Flex $direction="column" $align="flex-start" $padding={0} $gap={0.5}>
                    <div>Last Refresh</div>
                    <div>
                        {refreshedAt.toLocaleTimeString(locale, {
                            timeZoneName: "short"
                        })}
                    </div>
                </Flex>
                <button disabled={isRefreshDisabled} onClick={refetch}>
                    Refresh
                </button>
            </Flex>
        </Card>
    )
}
