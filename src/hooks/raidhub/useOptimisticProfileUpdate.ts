import { inferProcedureOutput } from "@trpc/server"
import { AppRouter } from "~/server/trpc"
import { trpc } from "~/util/trpc"

export function useOptimisticProfileUpdate(options?: {
    onSuccess(data: inferProcedureOutput<AppRouter["user"]["profile"]["update"]>): void
}) {
    const { user } = trpc.useContext()

    return trpc.user.profile.update.useMutation({
        onSuccess: options?.onSuccess,
        async onMutate(newData) {
            // Cancel outgoing fetches (so they don't overwrite our optimistic update)

            await user.profile.get.cancel()
            // Get the data from the queryCache
            const prevData = user.profile.get.getData()
            // Optimistically update the data with our new data
            if (prevData) {
                user.profile.get.setData(undefined, () => ({ ...prevData, ...newData }))
            }
            // Return the previous data so we can revert if something goes wrong
            return { prevData }
        },
        onError(err, newData, ctx) {
            if (ctx) {
                user.profile.get.setData(undefined, ctx.prevData)
            }
        },
        onSettled() {
            user.profile.get.invalidate()
        }
    })
}
