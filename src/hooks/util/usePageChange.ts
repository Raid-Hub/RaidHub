"use client"

import { useParams, usePathname } from "next/navigation"
import { MutableRefObject, useEffect } from "react"

export function usePageChange(
    callback: MutableRefObject<
        ((change: { newPath: string; newParams: ReturnType<typeof useParams> }) => void) | undefined
    >
) {
    const pathname = usePathname()
    const params = useParams()

    useEffect(() => {
        callback.current?.({
            newPath: pathname,
            newParams: params
        })
    }, [pathname, params, callback])

    return { pathname, params }
}
