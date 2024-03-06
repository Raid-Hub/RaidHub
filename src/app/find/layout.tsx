import { type Metadata } from "next"
import { type ReactNode } from "react"

import { metadata as rootMetaData } from "~/app/layout"

export default function Page({ children }: { children: ReactNode }) {
    return children
}

export const metadata: Metadata = {
    title: "Activity Finder",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Activity Finder"
    }
}
