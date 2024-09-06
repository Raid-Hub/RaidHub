import { type ReactNode } from "react"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { AnalyticsNav } from "./AnalyticsNav"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <PageWrapper>
            <AnalyticsNav />
            {children}
        </PageWrapper>
    )
}
