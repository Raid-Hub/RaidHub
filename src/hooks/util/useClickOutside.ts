import { useCallback, useEffect, type MutableRefObject } from "react"

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
    const handleClick = useCallback(
        (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handleClickOutside(event)
            }
        },
        [ref, handleClickOutside]
    )

    useEffect(() => {
        if (enabled) {
            const timer = setTimeout(() => document.addEventListener("click", handleClick), lockout)

            return () => {
                clearTimeout(timer)
                document.removeEventListener("click", handleClick)
            }
        }
    }, [lockout, enabled, handleClick])
}
