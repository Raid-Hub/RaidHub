"use client"

import { useEffect } from "react"
import { useMutableReference } from "./useMutableReference"

/**
 * Attaches an event listener to the window object.
 *
 * @template K - The event type.
 * @param {K} type - The event type to listen for.
 * @param {(ev: WindowEventMap[K]) => R} listener - The listener function to be called when the event occurs
 * @returns {void}
 */
export const useEventListener = <K extends keyof WindowEventMap>(
    type: K,
    listener: (ev: WindowEventMap[K]) => void,
    options?: {
        disabled?: boolean
    }
): void => {
    const mutableListener = useMutableReference(listener)

    useEffect(() => {
        if (!options?.disabled) {
            const handler = (ev: WindowEventMap[K]) => mutableListener.current(ev)

            window.addEventListener(type, handler)
            return () => {
                window.removeEventListener(type, handler)
            }
        }
    }, [type, options?.disabled, mutableListener])
}
