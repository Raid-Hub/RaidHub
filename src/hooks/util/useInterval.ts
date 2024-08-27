"use client"

import { useEffect } from "react"
import { useMutableReference } from "./useMutableReference"

/**
 * Custom hook that executes a function repeatedly at a specified interval.
 *
 * @param interval - The interval (in milliseconds) at which the function should be executed.
 * @param fn - The function to be executed.
 * @param opts - Optional configuration options.
 * @param opts.immediate - If set to true, the function will be executed immediately upon mounting.
 */
export const useInterval = (ms: number, callback: () => void) => {
    // Store the function in a ref so that it can be updated without causing a re-render.
    const mutableCallback = useMutableReference(callback)

    useEffect(() => {
        const intervalId = setInterval(() => mutableCallback.current(), ms)
        return () => {
            clearInterval(intervalId)
        }
    }, [mutableCallback, ms])
}
