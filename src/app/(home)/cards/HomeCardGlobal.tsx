"use client"

import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { HomeCardContentSectionItem } from "./content/HomeCardContentSectionItem"

export function HomeCardGlobal() {
    const { leaderboards } = useRaidHubManifest()
    return (
        <HomeCardGeneric
            id="Global"
            title="All Raids"
            backgroundImageCloudflareId="raidhubCitySplash"
            backgroundImageAltText="Splash for All Raids">
            <HomeCardContentSection sectionTitle="Individual Leaderboards">
                {leaderboards.global.map(board => (
                    <HomeCardContentSectionItem
                        key={board.category}
                        title={board.displayName}
                        href={`/leaderboards/global/${board.category}`}
                    />
                ))}
            </HomeCardContentSection>
        </HomeCardGeneric>
    )
}
