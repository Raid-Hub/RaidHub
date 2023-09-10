import { useCallback, useState } from "react"

export default function useDebouncedHover({
    action,
    debounce
}: {
    action: () => void
    debounce: number
}) {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

    const handleHover = () => {
        const timeout = setTimeout(() => {
            action()
        }, debounce)
        timer && clearTimeout(timer)
        setTimer(timeout)
    }

    const handleLeave = useCallback(() => {
        timer && clearTimeout(timer)
    }, [timer])

    return { handleHover, handleLeave }
}
