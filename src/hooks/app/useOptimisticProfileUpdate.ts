import { trpc } from "~/app/trpc"
import { type AppProfileUpdate } from "~/types/api"

export function useOptimisticProfileUpdate(options?: { onSuccess(data: AppProfileUpdate): void }) {
    const { user } = trpc.useUtils()

    return trpc.user.profile.update.useMutation<AppProfileUpdate>({
        onSuccess: options?.onSuccess,
        async onMutate(newData) {
            // Cancel outgoing fetches (so they don't overwrite our optimistic update)

            await user.profile.get.cancel()
            // Get the data from the queryCache
            const prevData = user.profile.get.getData()
            // Optimistically update the data with our new data
            if (prevData) {
                user.profile.get.setData(undefined, () => ({ ...prevData, ...newData }))
                // Return the previous data so we can revert if something goes wrong
                return prevData
            }
        },
        onError: (_, __, prevData) => {
            if (prevData) {
                user.profile.get.setData(undefined, prevData)
            }
        },
        onSettled: () => user.profile.get.invalidate()
    })
}
