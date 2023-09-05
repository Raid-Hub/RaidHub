import { middleware } from "."
import { TRPCError } from "@trpc/server"

export const isProtected = middleware(({ ctx, next }) => {
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
