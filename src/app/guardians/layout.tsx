import { type Metadata } from "next"
import { type ReactNode } from "react"
import { metadata as rootMetaData } from "~/app/layout"
import { PageWrapper } from "~/components/layout/PageWrapper"

export default function Page(params: { children: ReactNode }) {
    return <PageWrapper>{params.children}</PageWrapper>
}

export const metadata: Metadata = {
    title: "Guardians",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Guardians"
    }
}
