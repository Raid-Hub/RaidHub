import "server-only"

import { createTRPCProxyClient, loggerLink, TRPCClientError } from "@trpc/client"
import { callProcedure, getTRPCErrorFromUnknown } from "@trpc/server"
import { observable } from "@trpc/server/observable"
import { type TRPCErrorResponse } from "@trpc/server/rpc"
import { headers } from "next/headers"
import superjson from "superjson"
import { reactDedupe } from "~/util/react-cache"
import { createTRPCContext, type AppRouter } from "."
import { trpcErrorHandler } from "./errorHandler"
import { appRouter } from "./router"

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createServerContext = reactDedupe(() => {
    const headrs = new Headers(headers())
    headrs.set("x-trpc-source", "rsc")

    return createTRPCContext({
        headers: headrs
    })
})

export const trpcServer = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
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
                    createServerContext()
                        .then(ctx => {
                            return callProcedure({
                                procedures: appRouter._def.procedures,
                                path: op.path,
                                rawInput: op.input,
                                ctx,
                                type: op.type
                            }).catch(cause => {
                                void trpcErrorHandler({
                                    error: getTRPCErrorFromUnknown(cause),
                                    ctx,
                                    type: op.type,
                                    path: op.path,
                                    input: op.input,
                                    source: "rpc"
                                })
                                throw cause
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
