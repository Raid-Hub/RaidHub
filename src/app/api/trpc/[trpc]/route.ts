import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { type NextRequest } from "next/server"
import { createTRPCContext } from "../context"
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
        onError:
            process.env.NODE_ENV === "development"
                ? ({ path, error }) => {
                      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`)
                  }
                : undefined
    })

export { handler as GET, handler as POST }
