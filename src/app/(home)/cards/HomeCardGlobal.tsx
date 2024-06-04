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
                <HomeCardContentSectionItem title="Clears" href={`/leaderboards/global/clears`} />
                <HomeCardContentSectionItem
                    title="Full Clears"
                    href={`/leaderboards/global/freshClears`}
                />
                <HomeCardContentSectionItem title="Sherpas" href={`/leaderboards/global/sherpas`} />
            </HomeCardContentSection>
        </HomeCardGeneric>
    )
}
