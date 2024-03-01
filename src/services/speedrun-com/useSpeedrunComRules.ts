import { useQuery } from "@tanstack/react-query"
import type { SpeedrunCategoryResponse } from "~/types/speedrun-com"
import { baseUrl } from "./baseUrl"

export const useSpeedrunComRules = (params: { categoryId: string }) => {
    return useQuery({
        queryKey: ["speedrun-com", "rules", params.categoryId] as const,
        queryFn: async ({ queryKey }) => {
            const url = new URL(`/api/v1/categories/${queryKey[2]}`, baseUrl)
            const response = await fetch(url)
            const { data } = (await response.json()) as SpeedrunCategoryResponse
            return data
        },
        staleTime: 3600_000,
        select: data => data.rules
    })
}
