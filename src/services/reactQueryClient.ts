import { QueryClient } from "@tanstack/react-query"

const reactQueryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 60000, refetchOnWindowFocus: false }
    }
})

export default reactQueryClient
