"use client"

import { useEffect } from "react"

/**
 * Custom hook that executes a function repeatedly at a specified interval.
 *
 * @param interval - The interval (in milliseconds) at which the function should be executed.
 * @param fn - The memoized function to be executed.
 * @param opts - Optional configuration options.
 * @param opts.immediate - If set to true, the function will be executed immediately upon mounting.
 */
export const useInterval = (
    interval: number,
    fn: () => void,
    opts?: {
        immediate?: boolean
    }
) => {
    useEffect(() => {
        if (opts?.immediate) {
            fn()
        }
        const intervalId = setInterval(fn, interval)

        return () => {
            clearInterval(intervalId)
        }
    }, [fn, interval, opts?.immediate])
}
