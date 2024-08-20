import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { HomeCardContentSectionItem } from "./content/HomeCardContentSectionItem"

export function HomeCardGlobal() {
    return (
        <HomeCardGeneric
            title="All Raids"
            backgroundImageCloudflareId="raidhubCitySplash"
            backgroundImageAltText="Splash for All Raids">
            <HomeCardContentSection sectionTitle="Individual Leaderboards">
                <HomeCardContentSectionItem
                    title="Clears"
                    href="/leaderboards/individual/global/clears"
                />
                <HomeCardContentSectionItem
                    title="Full Clears"
                    href="/leaderboards/individual/global/freshClears"
                />
                <HomeCardContentSectionItem
                    title="Sherpas"
                    href="/leaderboards/individual/global/sherpas"
                />
                <HomeCardContentSectionItem
                    title="World First Race Power Rankings"
                    href="/leaderboards/individual/global/powerRankings"
                />
            </HomeCardContentSection>
        </HomeCardGeneric>
    )
}
