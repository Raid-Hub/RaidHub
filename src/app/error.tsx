"use client" // Error components must be Client Components

import { useEffect } from "react"
import { type ErrorBoundaryProps } from "~/types/generic"

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }>
                Try again
            </button>
        </div>
    )
}
