"use client"

import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"

export function HomeCardPantheon() {
    const { leaderboards } = useRaidHubManifest()
    return (
        <HomeCardGeneric
            id="Pantheon"
            title="Pantheon"
            backgroundImageCloudflareId="pantheonSplash"
            backgroundImageAltText="The Pantheon">
            <HomeCardContentSection sectionTitle="Individual Leaderboards">
                <></>
            </HomeCardContentSection>
            <HomeCardContentSection sectionTitle="First Completions">
                <></>
            </HomeCardContentSection>
        </HomeCardGeneric>
    )
}
