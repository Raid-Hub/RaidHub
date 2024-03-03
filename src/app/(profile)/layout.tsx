import { type ReactNode } from "react"

export const dynamic = "force-static"
export const revalidate = 24 * 3600

export default function Layout({ children }: { children: ReactNode }) {
    return <>{children}</>
}
