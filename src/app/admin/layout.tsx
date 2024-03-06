import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { type ReactNode } from "react"
import { getServerAuthSession } from "../(server)/api/auth"

export default async function Layout({ children }: { children: ReactNode }) {
    const session = await getServerAuthSession()

    if (session?.user.role !== "ADMIN") {
        redirect("/")
    }

    return <>{children}</>
}

export const metadata: Metadata = {
    robots: {
        follow: false,
        index: false
    },
    keywords: null,
    openGraph: null
}
