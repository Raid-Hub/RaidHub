"use client"

import { useEffect, useRef } from "react"

export function useMutableReference<T>(value: T) {
    const ref = useRef(value)

    useEffect(() => {
        ref.current = value
    }, [value])

    return ref
}
