import type { Metadata } from "next"
import { PageWrapper } from "~/components/layout/Page"
import { metadata as rootMetaData } from "../layout"
import { Cards } from "./HomeCards"
import { HomeLogo } from "./HomeLogo"
import { HomeToolButtons } from "./HomeToolButtons"
import { HomeSearchBar } from "./search/HomeSearchBar"

export default async function Page() {
    return (
        <PageWrapper>
            <HomeLogo />
            <HomeSearchBar />
            <HomeToolButtons />
            <Cards />
        </PageWrapper>
    )
}

export const metadata: Metadata = {
    title: "Home",
    openGraph: {
        ...rootMetaData.openGraph,
        title: "Home"
    }
}
