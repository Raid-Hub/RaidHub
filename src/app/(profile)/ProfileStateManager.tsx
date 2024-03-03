"use client"

import { useQueryClient } from "@tanstack/react-query"
import { type ReactNode } from "react"
import { trpc } from "~/app/trpc"
import { usePageProps } from "~/components/layout/PageWrapper"
import { type RaidHubPlayerResponse } from "~/services/raidhub/types"
import { type ProfileProps } from "./types"

// Ideally, this would move to template.tsx but there are no
// ways to pass props to the template !
export function ProfileStateManager(props: { children: ReactNode }) {
    // Server side props
    const { destinyMembershipId, ssrAppProfile, ssrRaidHubProfile } = usePageProps<ProfileProps>()

    const queryClient = useQueryClient()

    trpc.profile.getUnique.useQuery(
        {
            destinyMembershipId: destinyMembershipId
        },
        // We know the appProfile is ready,
        // so we can use it as initialData without worrying about hydration issues
        { enabled: false, initialData: ssrAppProfile }
    )

    // No reason to set the ssrDestinyProfile as initialData because it will
    // always be re-fetched on mount. It is placeholder data which contains only the
    // profile and character data components

    if (ssrRaidHubProfile) {
        queryClient.setQueryData<RaidHubPlayerResponse>(
            ["raidhub", "player", destinyMembershipId],
            old => old ?? ssrRaidHubProfile
        )
    }

    return props.children
}
