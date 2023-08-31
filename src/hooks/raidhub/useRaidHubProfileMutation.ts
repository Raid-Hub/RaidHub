import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCurrentUser } from "../../services/app/updateCurrentUser"
import { Profile, User } from "@prisma/client"
import { ModifiableUser } from "../../types/profile"
import { useSession } from "next-auth/react"
import { updateCurrentProfile } from "@/services/app/updateCurrentProfile"

export function useRaidHubProfileMutation(destinyMembershipId: string) {
    const queryClient = useQueryClient()
    const { update: updateSession, data: session } = useSession()

    const updateProfile = (data: Partial<Profile>) => {
        if (!session) {
            throw Error("No current session")
        } else {
            return updateCurrentProfile(data, session)
        }
    }

    return useMutation({
        mutationFn: updateProfile,
        onMutate: async req => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["raidhubProfile", destinyMembershipId] })

            // Snapshot the previous value
            const cache = queryClient.getQueryData(["raidhubProfile", destinyMembershipId]) as User

            // Optimistically update to the new value
            queryClient.setQueryData(["raidhubProfile", destinyMembershipId], { ...cache, ...req })
            return { cache }
        },
        onError: (err, req, context) => {
            queryClient.setQueryData(["raidhubProfile", destinyMembershipId], context?.cache)
        },
        onSuccess: () => updateSession()
    })
}
