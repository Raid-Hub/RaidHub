import { inferProcedureOutput } from "@trpc/server"
import { AppRouter } from "~/server/trpc"
import { trpc } from "~/util/trpc"

export function useOptimisticProfileUpdate(options?: {
    onSuccess(data: inferProcedureOutput<AppRouter["user"]["updateProfile"]>): void
}) {
    const { user } = trpc.useContext()

    return trpc.user.updateProfile.useMutation({
        onSuccess: options?.onSuccess,
        async onMutate(newData) {
            // Cancel outgoing fetches (so they don't overwrite our optimistic update)

            await user.getProfile.cancel()
            // Get the data from the queryCache
            const prevData = user.getProfile.getData()
            // Optimistically update the data with our new data
            if (prevData) {
                user.getProfile.setData(undefined, () => ({ ...prevData, ...newData }))
            }
            // Return the previous data so we can revert if something goes wrong
            return { prevData }
        },
        onError(err, newData, ctx) {
            if (ctx) {
                user.getProfile.setData(undefined, ctx.prevData)
            }
        },
        onSettled() {
            user.getProfile.invalidate()
        }
    })
}
