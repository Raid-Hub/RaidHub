import { type ReactNode } from "react"

// Global layout for all leaderboards
export const revalidate = 900
export const dynamic = "force-static"

export default function Layout({ children }: { children: ReactNode }) {
    return <>{children}</>
}
