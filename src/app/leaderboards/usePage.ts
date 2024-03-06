"use client"

import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { z } from "zod"

/**
 * Custom hook that retrieves the current page number from the URL search parameters.
 *
 * @returns The current page number. Defaults to 1 if the page number is not found or is invalid.
 */
export const usePage = () => {
    const searchParams = useSearchParams()
    const pageString = searchParams.get("page")
    return useMemo(() => {
        const pageParsed = z.coerce.number().int().positive().default(1).safeParse(pageString)
        return pageParsed.success ? pageParsed.data : 1
    }, [pageString])
}
