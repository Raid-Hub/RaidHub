import { AppRouter } from "@/server/trpc"
import { reactQueryClient } from "@/util/reactQueryClient"
import { httpBatchLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"

function getBaseUrl() {
    if (typeof window !== "undefined") {
        // browser should use relative path
        return ""
    } else if (process.env.VERCEL_URL) {
        // reference for vercel.com
        return `https://${process.env.VERCEL_URL}`
    } else {
        return "https://127.0.0.1"
    }
}

export const trpc = createTRPCNext<AppRouter>({
    config(ctx) {
        return {
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/`
                })
            ],
            queryClient: reactQueryClient
        }
    },
    ssr: false
})
