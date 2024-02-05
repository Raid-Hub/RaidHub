import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { HomeCardContentSectionItem } from "./content/HomeCardContentSectionItem"

export function HomeCardGlobal() {
    return (
        <HomeCardGeneric
            id="Global"
            title="All Raids"
            backgroundImageCloudflareId="5e4dc4de-9417-4aef-2a48-aea495ae3500"
            backgroundImageAltText="Splash for All Raids">
            <HomeCardContentSection sectionTitle="Individual Leaderboards">
                <HomeCardContentSectionItem
                    title="Full Clears"
                    href="/leaderboards/all/full-clears"
                />
                <HomeCardContentSectionItem title="Clears" href="/leaderboards/all/clears" />
                <HomeCardContentSectionItem
                    title="Cumulative Speedrun"
                    href="/leaderboards/all/speed"
                />
                <HomeCardContentSectionItem title="Sherpas" href="/leaderboards/all/sherpas" />
            </HomeCardContentSection>
        </HomeCardGeneric>
    )
}
