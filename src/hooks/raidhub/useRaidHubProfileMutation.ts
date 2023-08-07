import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCurrentUser } from "../../services/app/updateCurrentUser"
import { User } from "@prisma/client"

export function useRaidHubProfileMutation(destinyMembershipId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<User>) => updateCurrentUser(data),
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
        }
    })
}
