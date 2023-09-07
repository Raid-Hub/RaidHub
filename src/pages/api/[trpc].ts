import * as trpcNext from "@trpc/server/adapters/next"
import { createContext } from "~/server/trpc/context"
import { appRouter } from "~/server/trpc/router"

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
