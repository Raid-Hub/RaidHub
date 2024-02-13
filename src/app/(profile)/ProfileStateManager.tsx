"use client"

import { useQueryClient } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { trpc } from "~/app/trpc"
import { usePageProps } from "~/components/layout/PageWrapper"
import { getUseProfileQueryKey, type UseProfileQueryData } from "~/services/bungie/useProfile"
import { type RaidHubPlayerResponse } from "~/types/raidhub-api"
import { type ProfileProps } from "./types"

// Ideally, this would move to template.tsx but there are no
// ways to pass props to the template !
export function ProfileStateManager(props: { children: ReactNode }) {
    // Server side props
    const {
        destinyMembershipId,
        destinyMembershipType,
        ssrAppProfile,
        ssrDestinyProfile,
        ssrRaidHubProfile
    } = usePageProps<ProfileProps>()

    const queryClient = useQueryClient()

    trpc.profile.getUnique.useQuery(
        {
            destinyMembershipId: destinyMembershipId
        },
        // We know the appProfile is ready,
        // so we can use it as initialData without worrying about hydration issues
        { enabled: false, initialData: ssrAppProfile }
    )

    if (ssrDestinyProfile) {
        queryClient.setQueryData<UseProfileQueryData>(
            getUseProfileQueryKey(destinyMembershipId, destinyMembershipType),
            old => old ?? ssrDestinyProfile,
            {
                // Forces the query to refetch on the next render because the SSR data
                // only contains some of the components of the response
                updatedAt: 0
            }
        )
    }

    if (ssrRaidHubProfile) {
        queryClient.setQueryData<RaidHubPlayerResponse>(
            ["raidhub", "player", destinyMembershipId],
            old => old ?? ssrRaidHubProfile
        )
    }

    return props.children
}
