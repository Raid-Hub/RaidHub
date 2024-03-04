import { type MutableRefObject, useEffect, useState } from "react"

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
        const currentRef = ref.current

        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [ref, options, callback])

    return isIntersecting
}
