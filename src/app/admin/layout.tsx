import { Metadata } from "next"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { getServerAuthSession } from "../api/auth"

export default async function Layout(params: { children: ReactNode }) {
    const session = await getServerAuthSession()

    if (session?.user.role !== "ADMIN") {
        redirect("/")
    }

    return params.children
}

export const metadata: Metadata = {
    robots: {
        follow: false,
        index: false
    },
    keywords: null,
    openGraph: null
}
