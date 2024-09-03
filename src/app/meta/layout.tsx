import { type ReactNode } from "react"
import { PageWrapper } from "~/components/layout/PageWrapper"

export default function Layout({ children }: { children: ReactNode }) {
    return <PageWrapper>{children}</PageWrapper>
}
