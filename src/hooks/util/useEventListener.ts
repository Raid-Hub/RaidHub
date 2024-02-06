"use client"

import { useEffect } from "react"

/**
 * Attaches an event listener to the window object.
 *
 * @template K - The event type.
 * @template R - The return type of the listener function.
 * @param {K} type - The event type to listen for.
 * @param {(this: Window, ev: WindowEventMap[K]) => R} listener - The listener function to be called when the event occurs. **Must be memoized.**
 * @returns {void}
 */
export const useEventListener = <K extends keyof WindowEventMap, R>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => R
): void => {
    useEffect(() => {
        window.addEventListener(type, listener)

        return () => {
            window.removeEventListener(type, listener)
        }
    }, [type, listener])
}
