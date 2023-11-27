import { middleware, publicProcedure } from "."
import { TRPCError } from "@trpc/server"

const authenticatedMidddleware = middleware(({ ctx, next }) => {
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

export const protectedProcedure = publicProcedure.use(authenticatedMidddleware)

const adminMiddleware = middleware(({ ctx, next }) => {
    if (!ctx.session || ctx?.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return next({
        ctx: {
            ...ctx,
            session: ctx.session
        }
    })
})

export const adminProcedure = publicProcedure.use(adminMiddleware)
