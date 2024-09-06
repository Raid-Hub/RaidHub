import { type ReactNode } from "react"
import { metadata as rootMetadata } from "~/app/layout"

export default function Layout({ children }: { children: ReactNode }) {
    return <>{children}</>
}

const title = "Player Population"
const description = "View the population of players in Destiny 2 raids over time"

export const metadata = {
    title,
    description,
    keywords: [...rootMetadata.keywords, "population", "graph", "analytics", "chart"],
    openGraph: {
        ...rootMetadata.openGraph,
        title,
        description
    }
}
