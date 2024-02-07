"use client"

import { signOut } from "next-auth/react"

export const SignOut = () => {
    signOut({ callbackUrl: "/" })

    return null
}
