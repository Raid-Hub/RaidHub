import { PageWrapper } from "~/components/layout/PageWrapper"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { metadata as rootMetadata } from "../layout"
import { Cards } from "./HomeCards"
import { HomeLogo } from "./HomeLogo"
import { HomeToolButtons } from "./HomeToolButtons"
import { HomeSearchBar } from "./search/HomeSearchBar"

export const revalidate = 180 // static revalidation (5 minutes in seconds)

export async function generateMetadata() {
    const manifest = await prefetchManifest()

    return {
        keywords: [
            ...rootMetadata.keywords,
            ...Object.values(manifest.activityDefinitions)
                .map(def => def.name)
                .reverse()
        ].filter(Boolean)
    }
}
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
