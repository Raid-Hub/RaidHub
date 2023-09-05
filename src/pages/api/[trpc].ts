import { appRouter } from "@/server/trpc"
import { createContext } from "@/server/trpc/context"
import * as trpcNext from "@trpc/server/adapters/next"

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: createContext,
    onError({ error }) {
        // todo
    },
    batching: {
        enabled: true
    }
})
