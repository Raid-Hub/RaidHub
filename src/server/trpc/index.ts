import { inferRouterOutputs, initTRPC } from "@trpc/server"
import { Context } from "./context"
import { ZodError } from "zod"
import superjson from "superjson"
import { appRouter } from "./router"

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
            }
        }
    }
})

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure

// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter
export type RouterOutput = inferRouterOutputs<AppRouter>
