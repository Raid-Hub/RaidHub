import { createNextApiHandler } from "@trpc/server/adapters/next"
import { createContext } from "~/server/trpc/context"
import { appRouter } from "~/server/trpc/router"

export default createNextApiHandler({
    router: appRouter,
    createContext: createContext,
    batching: {
        enabled: false
    }
})
