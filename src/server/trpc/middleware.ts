import { middleware, publicProcedure } from "."
import { TRPCError } from "@trpc/server"

const isProtected = middleware(({ ctx, next }) => {
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

export const protectedProcedure = publicProcedure.use(isProtected)
