"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { z } from "zod"

export default function Page() {
    const query = useSearchParams()

    const callbackUrl = z
        .string()
        .url()
        .transform(cb => (cb === "/login" ? "" : cb))
        .default("")
        .safeParse(query.get("callbackUrl"))

    const error = query.get("error")

    return (
        <main>
            {error ? (
                <h2>{`Error: ${error}`}</h2>
            ) : (
                <button
                    onClick={() =>
                        signIn("bungie", {
                            callbackUrl: callbackUrl.success ? callbackUrl.data : ""
                        })
                    }>
                    Log In
                </button>
            )}
        </main>
    )
}
