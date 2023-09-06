import { useSession } from "next-auth/react"
import { trpc } from "~/util/trpc"

export function useOptimisticProfileUpdate() {
    const { profile } = trpc.useContext()
    const { data: session } = useSession()

    return trpc.user.updateProfile.useMutation({
        async onMutate(newData) {
            // Cancel outgoing fetches (so they don't overwrite our optimistic update)
            if (session?.user) {
                await profile.getProfile.cancel({
                    destinyMembershipId: session.user.destinyMembershipId
                })
                // Get the data from the queryCache
                const prevData = profile.getProfile.getData()
                // Optimistically update the data with our new data
                if (prevData) {
                    profile.getProfile.setData(
                        {
                            destinyMembershipId: session.user.destinyMembershipId
                        },
                        () => ({ ...prevData, ...newData })
                    )
                }
                // Return the previous data so we can revert if something goes wrong
                return { prevData }
            }
        },
        onError(err, newData, ctx) {
            if (session?.user && ctx) {
                profile.getProfile.setData(
                    { destinyMembershipId: session.user.destinyMembershipId },
                    ctx.prevData
                )
            }
        },
        onSettled() {
            profile.getProfile.invalidate()
        }
    })
}
