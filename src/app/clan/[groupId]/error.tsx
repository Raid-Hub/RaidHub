"use client"

import { useEffect } from "react"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { BungieAPIError } from "~/models/BungieAPIError"
import { ErrorBoundaryProps } from "~/types/generic"

export default function ClanErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <PageWrapper>
            {error instanceof BungieAPIError ? (
                <h1>{error.Message}</h1>
            ) : (
                <h1>Something went wrong!</h1>
            )}
            <button onClick={() => reset()}>Try again</button>
        </PageWrapper>
    )
}
