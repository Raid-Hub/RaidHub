import { Metadata } from "next"
import { ReactNode } from "react"
import { metadata as rootMetaData } from "~/app/layout"

export default function Layout(params: { children: ReactNode }) {
    return params.children
}

export const metadata: Metadata = {
    title: "Raid Rotator Calendar",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Raid Rotator Calendar"
    }
}
