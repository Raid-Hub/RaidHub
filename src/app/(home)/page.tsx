import type { Metadata } from "next"
import { metadata as rootMetaData } from "../layout"

export default async function Page() {
    return null
}

export const metadata: Metadata = {
    title: "Home",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Home"
    }
}
