import "server-only"

import { createTRPCProxyClient, loggerLink, TRPCClientError } from "@trpc/client"
import { callProcedure, inferAsyncReturnType } from "@trpc/server"
import { observable } from "@trpc/server/observable"
import { type TRPCErrorResponse } from "@trpc/server/rpc"
import { headers } from "next/headers"
import { cache } from "react"

import { inferRouterOutputs, initTRPC, TRPCError } from "@trpc/server"
import { Session } from "next-auth"
import superjson from "superjson"
import { ZodError } from "zod"
import { transformer } from "../../trpc"
import { appRouter } from "./router"

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
    const heads = new Headers(headers())
    heads.set("x-trpc-source", "rsc")

    return createTRPCContext({
        headers: heads
    })
})

export const api = createTRPCProxyClient<AppRouter>({
    transformer,
    links: [
        loggerLink({
            enabled: op =>
                process.env.NODE_ENV === "development" ||
                (op.direction === "down" && op.result instanceof Error)
        }),
        /**
         * Custom RSC link that lets us invoke procedures without using http requests. Since Server
         * Components always run on the server, we can just call the procedure as a function.
         */
        () =>
            ({ op }) =>
                observable(observer => {
                    createContext()
                        .then(ctx => {
                            return callProcedure({
                                procedures: appRouter._def.procedures,
                                path: op.path,
                                rawInput: op.input,
                                ctx,
                                type: op.type
                            })
                        })
                        .then(data => {
                            observer.next({ result: { data } })
                            observer.complete()
                        })
                        .catch((cause: TRPCErrorResponse) => {
                            observer.error(TRPCClientError.from(cause))
                        })
                })
    ]
})

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

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter
export type RouterOutput = inferRouterOutputs<AppRouter>

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await getServerAuthSession()

    return {
        prisma: prisma,
        session,
        ...opts
    }
}

export type Context = inferAsyncReturnType<typeof createContext>

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
