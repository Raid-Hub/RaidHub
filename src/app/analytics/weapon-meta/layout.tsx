import { type ReactNode } from "react"
import { metadata as rootMetadata } from "~/app/layout"

export default function Layout({ children }: { children: ReactNode }) {
    return <>{children}</>
}

const title = "Weapon Meta"
const description = "View the weekly raiding meta for weapons in Destiny 2"

export const metadata = {
    title,
    description,
    keywords: [...rootMetadata.keywords, "weapons", "meta", "analytics"],
    openGraph: {
        ...rootMetadata.openGraph,
        title,
        description
    }
}
