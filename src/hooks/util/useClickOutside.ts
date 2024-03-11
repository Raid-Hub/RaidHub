import { useCallback, useEffect, type MutableRefObject } from "react"

export function useClickOutside<T extends HTMLElement>(
    ref: MutableRefObject<T | null>,
    callback: (event: MouseEvent) => void,
    config: {
        enabled: boolean
        lockout?: number
    }
) {
    const handleClick = useCallback(
        (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(event)
            }
        },
        [ref, callback]
    )

    useEffect(() => {
        if (config.enabled) {
            const timer = setTimeout(
                () => window.addEventListener("click", handleClick),
                config.lockout
            )

            return () => {
                clearTimeout(timer)
                window.removeEventListener("click", handleClick)
            }
        }
    }, [handleClick, config.enabled, config.lockout])
}
