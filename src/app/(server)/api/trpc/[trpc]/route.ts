import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { type NextRequest } from "next/server"
import { createTRPCContext } from ".."
import { trpcErrorHandler } from "../errorHandler"
import { appRouter } from "../router"

const handler = (req: NextRequest) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () =>
            createTRPCContext({
                headers: req.headers
            }),
        onError: trpcErrorHandler
    })

export { handler as GET, handler as POST }
