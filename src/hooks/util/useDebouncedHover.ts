import { useCallback, useReducer } from "react"

const reducer = (prevTimer: NodeJS.Timeout | null, newTimer: NodeJS.Timeout | null) => {
    if (prevTimer) clearTimeout(prevTimer)

    return newTimer
}

export const useDebouncedHover = ({
    action,
    debounce
}: {
    action: () => void
    debounce: number
}) => {
    const [, setTimer] = useReducer(reducer, null)

    const handleHover = useCallback(() => {
        const timeout = setTimeout(() => {
            action()
        }, debounce)
        setTimer(timeout)
    }, [action, debounce])

    const handleLeave = useCallback(() => {
        setTimer(null)
    }, [])

    return { handleHover, handleLeave }
}
