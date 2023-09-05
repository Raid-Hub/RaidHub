import { inferRouterOutputs, initTRPC } from "@trpc/server"
import { Context } from "./context"
import { appRouter } from "./router"

const t = initTRPC.context<Context>().create()
export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure

// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter
export type RouterOutput = inferRouterOutputs<AppRouter>
