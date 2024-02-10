"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function ForceClientSideBungieSignIn() {
    const params = useSearchParams()

    useEffect(() => {
        signIn("bungie", {
            callbackUrl: params.get("callbackUrl") || undefined
        })
    }, [])

    return null
}
