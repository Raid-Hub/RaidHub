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
            <HomeCardContentSection sectionTitle="Clears">
                {pantheonVersions.map(version => (
                    <HomeCardContentSectionItem
                        key={version}
                        title={getVersionString(version)}
                        href={`/leaderboards/pantheon/${getUrlPathForVersion(version)}/fullClears`}
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
        </HomeCardGeneric>
    )
}
