import { MutableRefObject, useEffect, useState } from "react"

export function useIsVisible<E extends HTMLElement>(
    ref: MutableRefObject<E | null>,
    options?: IntersectionObserverInit,
    callback?: (isVisible: boolean) => void
) {
    const [isIntersecting, setIntersecting] = useState(false)

    useEffect(() => {
        const intersectionCallback: IntersectionObserverCallback = ([entry]) => {
            callback?.(entry.isIntersecting)
            setIntersecting(entry.isIntersecting)
        }

        const observer = new IntersectionObserver(intersectionCallback, options)

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [ref, options])

    return isIntersecting
}
