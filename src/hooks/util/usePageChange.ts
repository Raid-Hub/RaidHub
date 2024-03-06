"use client"

import { useParams, usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export function usePageChange(
    callback:
        | ((change: { newPath: string; newParams: ReturnType<typeof useParams> }) => void)
        | undefined
) {
    const cb = useRef(callback)
    cb.current = callback
    const pathname = usePathname()
    const params = useParams()

    useEffect(() => {
        cb.current?.({
            newPath: pathname,
            newParams: params
        })
    }, [pathname, params, cb])

    return { pathname, params }
}
