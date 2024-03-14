"use client"

import { useQueryClient } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { trpc } from "~/app/trpc"
import { usePageProps } from "~/components/layout/PageWrapper"
import { type RaidHubPlayerBasic, type RaidHubPlayerResponse } from "~/services/raidhub/types"
import { type ProfileProps } from "./types"

export function ProfileStateManager(props: { children: ReactNode }) {
    // Server side props
    const { destinyMembershipId, ssrAppProfile, ssrRaidHubProfile, ssrRaidHubBasic } =
        usePageProps<ProfileProps>()

    const queryClient = useQueryClient()

    trpc.profile.getUnique.useQuery(
        {
            destinyMembershipId: destinyMembershipId
        },
        // We know the appProfile is ready,
        // so we can use it as initialData without worrying about hydration issues
        { enabled: false, initialData: ssrAppProfile }
    )

    if (ssrRaidHubProfile) {
        queryClient.setQueryData<RaidHubPlayerResponse>(
            ["raidhub", "player", destinyMembershipId],
            // Set the query data if it doesn't exist
            old => old ?? ssrRaidHubProfile
        )
        queryClient.setQueryData<RaidHubPlayerBasic>(
            ["raidhub", "player", "basic", destinyMembershipId],
            // Set the query data if it doesn't exist
            old => old ?? ssrRaidHubProfile.player
        )
    } else if (ssrRaidHubBasic) {
        queryClient.setQueryData<RaidHubPlayerBasic>(
            ["raidhub", "player", "basic", destinyMembershipId],
            // Set the query data if it doesn't exist
            old => old ?? ssrRaidHubBasic
        )
    }

    return <>{props.children}</>
}
