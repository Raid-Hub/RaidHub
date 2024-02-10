import "server-only"

import { inferRouterOutputs, initTRPC, TRPCError } from "@trpc/server"
import { Session } from "next-auth"
import superjson from "superjson"
import { ZodError } from "zod"
import { createTRPCContext } from "./context"
import { appRouter } from "./router"

const t = initTRPC.context<typeof createTRPCContext>().create({
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

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter
export type RouterOutput = inferRouterOutputs<AppRouter>

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
    if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return next({
        ctx: {
            ...ctx,
            session: ctx.session
        }
    })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return next({
        ctx: {
            ...ctx,
            session: ctx.session as Session & { user: { role: "ADMIN" } }
        }
    })
})
