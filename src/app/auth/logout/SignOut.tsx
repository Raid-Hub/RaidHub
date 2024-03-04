"use client"

import { signOut } from "next-auth/react"
import { type ReactNode } from "react"

export const SignOut = (): ReactNode => {
    void signOut({ callbackUrl: "/" })

    return null
}
