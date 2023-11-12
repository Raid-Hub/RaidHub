import { MutableRefObject, useCallback, useEffect } from "react"

export function useClickOutside<T extends HTMLElement>(
    {
        ref,
        enabled,
        lockout = 300
    }: {
        ref: MutableRefObject<T | null>
        enabled: boolean
        lockout?: number
    },
    handleClickOutside: (event: MouseEvent) => void
) {
    const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            handleClickOutside(event)
        }
    }

    useEffect(() => {
        if (enabled) {
            const timer = setTimeout(() => document.addEventListener("click", handleClick), lockout)

            return () => {
                clearTimeout(timer)
                document.removeEventListener("click", handleClick)
            }
        }
    }, [lockout, enabled])
}
