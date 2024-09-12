import { type Metadata } from "next"
import { type ReactNode } from "react"
import { PageWrapper } from "~/components/layout/PageWrapper"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <PageWrapper>
            <h1>RaidHub Summary Generator</h1>
            <p>Select players in order to generate a combined report of all their stats.</p>
            {children}
        </PageWrapper>
    )
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Summary Generator",
        robots: {
            index: false,
            follow: true
        }
    }
}
