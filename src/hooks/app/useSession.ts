import { SessionContext, SessionContextValue, UseSessionOptions } from "next-auth/react"
import { useContext, useEffect } from "react"

/**
 * This is an override of the useSession hook from next-auth/react
 *
 * React Hook that gives you access
 * to the logged in user's session data.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#usesession)
 */
export function useSession<R extends boolean>(
    options?: UseSessionOptions<R>
): SessionContextValue<R> {
    const ctx = useContext(SessionContext)
    if (!ctx) {
        return {
            data: null,
            status: "loading",
            update: () => {
                throw new Error("Cannot update session when it is not loaded")
            }
        }
    }

    const { required, onUnauthenticated } = options ?? {}

    const requiredAndNotLoading = required && ctx.status === "unauthenticated"

    useEffect(() => {
        if (requiredAndNotLoading) {
            const url = `/api/auth/signin?${new URLSearchParams({
                error: "SessionRequired",
                callbackUrl: window.location.href
            })}`
            if (onUnauthenticated) onUnauthenticated()
            else window.location.href = url
        }
    }, [requiredAndNotLoading, onUnauthenticated])

    if (requiredAndNotLoading) {
        return {
            data: ctx.data,
            update: ctx.update,
            status: "loading"
        }
    }

    return ctx as SessionContextValue<R>
}
