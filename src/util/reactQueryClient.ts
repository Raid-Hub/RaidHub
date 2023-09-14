import { QueryClient } from "@tanstack/react-query"

export const reactQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60000,
            refetchOnWindowFocus: false,
            retry: false,
            suspense: false
        }
    }
})
