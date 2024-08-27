"use client"

import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import { useMutableReference } from "./useMutableReference"

export function usePageChange(
    callback:
        | ((change: { newPath: string; newParams: ReturnType<typeof useParams> }) => void)
        | undefined
) {
    const mutableCallback = useMutableReference(callback)
    const pathname = usePathname()
    const params = useParams()

    useEffect(() => {
        mutableCallback.current?.({
            newPath: pathname,
            newParams: params
        })
    }, [pathname, params, mutableCallback])

    return { pathname, params }
}
