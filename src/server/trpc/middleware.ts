import { TRPCError } from "@trpc/server"
import { Session } from "next-auth"
import { middleware, publicProcedure } from "."

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
            session: ctx.session as Session & { user: { role: "ADMIN" } }
        }
    })
})

export const adminProcedure = publicProcedure.use(adminMiddleware)
