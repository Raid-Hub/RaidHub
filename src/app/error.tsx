"use client" // Error components must be Client Components

import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { type ErrorBoundaryProps } from "~/types/generic"
import { trpc } from "./trpc"

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    const pathname = usePathname()
    const params = useParams()
    const searchParams = useSearchParams()

    const { mutate: postError } = trpc.monitoring.unhandledClientError.useMutation()

    useEffect(() => {
        const err = {
            next: {
                pathname,
                params,
                searchParams: searchParams.toString()
            },
            error: {
                className: error.constructor.name,
                message: error.message,
                stack: error.stack
            }
        }
        postError(err)
        console.error(err)
    }, [error, postError, params, pathname, searchParams])

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
            <button onClick={() => window.location.reload()}>Hard reload</button>
            <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
    )
}
