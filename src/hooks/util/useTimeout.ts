"use client"

import { useEffect, type DependencyList } from "react"

export const useTimeout = (callback: () => void, ms: number, deps: DependencyList) => {
    useEffect(() => {
        const timer = setTimeout(callback, ms)

        return () => {
            clearTimeout(timer)
        }
    }, [callback, ms, deps])
}
