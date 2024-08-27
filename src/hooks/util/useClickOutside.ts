import { useEffect, type MutableRefObject } from "react"
import { useMutableReference } from "./useMutableReference"

export function useClickOutside<T extends HTMLElement>(
    ref: MutableRefObject<T | null>,
    callback: (event: MouseEvent) => void,
    config: {
        enabled: boolean
        lockout?: number
    }
) {
    const mutableCallback = useMutableReference(callback)

    useEffect(() => {
        if (config.enabled) {
            const handleClick = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    mutableCallback.current(event)
                }
            }
            const timeoutId = setTimeout(
                () => window.addEventListener("click", handleClick),
                config.lockout
            )

            return () => {
                clearTimeout(timeoutId)
                window.removeEventListener("click", handleClick)
            }
        }
    }, [config.enabled, config.lockout, ref, mutableCallback])
}
