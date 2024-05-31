"use client"

import { useRaidHubManifest } from "~/app/layout/managers"
import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { HomeCardContentSectionItem } from "./content/HomeCardContentSectionItem"

export function HomeCardPantheon() {
    const { pantheonVersions, getVersionString, getUrlPathForVersion } = useRaidHubManifest()
    return (
        <HomeCardGeneric
            title="Pantheon"
            backgroundImageCloudflareId="pantheonSplash"
            backgroundImageAltText="The Pantheon">
            <HomeCardContentSection sectionTitle="First Completions">
                {pantheonVersions.map(version => (
                    <HomeCardContentSectionItem
                        key={version}
                        title={getVersionString(version)}
                        href={`/leaderboards/pantheon/${getUrlPathForVersion(version)}/first`}
                    />
                ))}
            </HomeCardContentSection>
            <HomeCardContentSection sectionTitle="High Score">
                {pantheonVersions.map(version => (
                    <HomeCardContentSectionItem
                        key={version}
                        title={getVersionString(version)}
                        href={`/leaderboards/pantheon/${getUrlPathForVersion(version)}/score`}
                    />
                ))}
            </HomeCardContentSection>
            <HomeCardContentSection sectionTitle="Individual Leaderboards">
                <HomeCardContentSectionItem
                    title="Full Clears"
                    href={`/leaderboards/pantheon/all/clears`}
                />
                <HomeCardContentSectionItem
                    title="Score"
                    href={`/leaderboards/pantheon/all/score`}
                />
            </HomeCardContentSection>
        </HomeCardGeneric>
    )
}
