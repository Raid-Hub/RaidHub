import { initTRPC } from "@trpc/server"
import { Context } from "./context"
import { isProtected } from "./middleware"
import { appRouter } from "./router"
// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.context<Context>().create()
export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure
export const protectedProcedure = publicProcedure.use(isProtected)

// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter
