"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { useState } from "react"
import type { AppRouter } from "../api/trpc"
import { getUrl, transformer } from "../trpc"

export const api = createTRPCReact<AppRouter>()

export function QueryManager(props: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    const [trpcClient] = useState(() =>
        api.createClient({
            transformer: transformer,
            links: [
                loggerLink({
                    enabled: op =>
                        process.env.NODE_ENV === "development" ||
                        (op.direction === "down" && op.result instanceof Error)
                }),
                unstable_httpBatchStreamLink({
                    url: getUrl()
                })
            ]
        })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider client={trpcClient} queryClient={queryClient}>
                {props.children}
            </api.Provider>
        </QueryClientProvider>
    )
}
