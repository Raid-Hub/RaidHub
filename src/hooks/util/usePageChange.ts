"use client"

import { useParams, usePathname } from "next/navigation"
import { MutableRefObject, useEffect } from "react"

export function usePageChange(props: {
    callback: MutableRefObject<
        (change: { newPath: string; newParams: ReturnType<typeof useParams> }) => void
    >
}) {
    const pathname = usePathname()
    const params = useParams()

    useEffect(() => {
        props.callback.current({
            newPath: pathname,
            newParams: params
        })
    }, [pathname, params, props.callback])

    return { pathname, params }
}
