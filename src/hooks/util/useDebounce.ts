import { Dispatch, SetStateAction, useEffect, useState } from "react"

/**
 * Custom hook that debounces a value.
 *
 * @template T - The type of the value.
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {[T, Dispatch<SetStateAction<T>>]} - The debounced value and a function to force-update the value.
 */
export const useDebounce = <T>(value: T, delay: number): [T, Dispatch<SetStateAction<T>>] => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [value, delay])

    return [debouncedValue, setDebouncedValue]
}
