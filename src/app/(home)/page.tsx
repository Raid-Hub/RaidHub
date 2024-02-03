import type { Metadata } from "next"
import { PageWrapper } from "~/components/layout/Page"
import { metadata as rootMetaData } from "../layout"
import { RaidCards } from "./RaidCards"

export default async function Page() {
    return (
        <PageWrapper>
            {/* <HomeLogo />
            <HomeSearch />
            <HomeToolButtons /> */}
            <RaidCards />
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
