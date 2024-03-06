"use client"

import { type Session } from "next-auth"
import { signIn } from "next-auth/react"
import { type ReactNode } from "react"
import { useSession } from "~/hooks/app/useSession"

export function ForceClientSideBungieSignIn(props: {
    callbackUrl?: string
    whenSignedIn: (session: Session) => ReactNode
}) {
    const { data } = useSession({
        required: true,
        onUnauthenticated() {
            void signIn("bungie", {
                callbackUrl: props.callbackUrl
            })
        }
    })

    if (data) {
        return props.whenSignedIn(data)
    } else {
        return null
    }
}
