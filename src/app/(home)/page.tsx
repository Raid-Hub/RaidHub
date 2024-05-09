import { PageWrapper } from "~/components/layout/PageWrapper"
import { Cards } from "./HomeCards"
import { HomeLogo } from "./HomeLogo"
import { HomeToolButtons } from "./HomeToolButtons"
import { HomeSearchBar } from "./search/HomeSearchBar"

export const revalidate = 180 // static revalidation (5 minutes in seconds)
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
