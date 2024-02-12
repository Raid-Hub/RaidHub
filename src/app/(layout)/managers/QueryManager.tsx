"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { httpLink, loggerLink } from "@trpc/client"
import { useState } from "react"
import superjson from "superjson"
import { trpc } from "~/app/trpc"

function getBaseUrl() {
    if (typeof window !== "undefined") return ""
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return `https://localhost:${process.env.PORT ?? 3000}`
}

export function QueryManager(props: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60000,
                        refetchOnWindowFocus: false,
                        retry: false,
                        suspense: false
                    }
                }
            })
    )

    const [trpcClient] = useState(() =>
        trpc.createClient({
            transformer: superjson,
            links: [
                loggerLink({
                    enabled: op =>
                        process.env.NODE_ENV === "development" ||
                        (op.direction === "down" && op.result instanceof Error)
                }),
                httpLink({
                    url: getBaseUrl() + "/api/trpc"
                })
            ]
        })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {/* By default, React Query Devtools are only included in bundles when 
            process.env.NODE_ENV === 'development', so you don't need to worry
             about excluding them during a production build. */}
            <ReactQueryDevtools initialIsOpen={false} />
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                {props.children}
            </trpc.Provider>
        </QueryClientProvider>
    )
}
