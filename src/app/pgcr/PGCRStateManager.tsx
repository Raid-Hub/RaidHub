"use client"

import { useQueryClient, type UseQueryResult } from "@tanstack/react-query"
import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useRaidHubActivity } from "~/services/raidhub/hooks"
import type { RaidHubActivityResponse } from "~/services/raidhub/types"
import type { PGCRPageProps } from "./types"

const PGCRContext = createContext<UseQueryResult<RaidHubActivityResponse> | undefined>(undefined)

export const usePGCRContext = () => {
    const ctx = useContext(PGCRContext)
    if (!ctx) throw new Error("usePGCRContext must be used within a PGCRContextProvider")

    return ctx
}

export const PGCRStateManager = ({
    instanceId,
    ssrActivity,
    isReady,
    children
}: PGCRPageProps & { children: ReactNode }) => {
    const queryClient = useQueryClient()

    useEffect(() => {
        if (ssrActivity) {
            queryClient.setQueryData<RaidHubActivityResponse>(
                ["raidhub", "activity", instanceId],
                old => old ?? ssrActivity
            )
        }
    }, [queryClient, ssrActivity, instanceId])

    const activityQuery = useRaidHubActivity(instanceId, {
        enabled: isReady,
        staleTime: 3600_000
    })

    return <PGCRContext.Provider value={activityQuery}>{children}</PGCRContext.Provider>
}
