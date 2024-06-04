"use client"

import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { getRaidSplash } from "~/data/activity-images"
import { SpeedrunVariables } from "~/data/speedrun-com-mappings"
import { o } from "~/util/o"
import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { HomeCardContentSectionItem } from "./content/HomeCardContentSectionItem"

const raidHubBoards = [
    ["Clears", "clears"],
    ["Full Clears", "freshClears"],
    ["Sherpas", "sherpas"]
]

export const HomeCardRaid = ({ raidId }: { raidId: number }) => {
    const {
        reprisedRaids,
        getVersionsForActivity,
        getActivityString,
        getVersionString,
        getUrlPathForVersion,
        getUrlPathForActivity
    } = useRaidHubManifest()

    const raidUrlPath = getUrlPathForActivity(raidId)

    if (!raidUrlPath) return null

    const isReprised = reprisedRaids.includes(raidId)
    const miscBoards = getVersionsForActivity(raidId)

    return (
        <HomeCardGeneric
            title={getActivityString(raidId)}
            backgroundImageCloudflareId={getRaidSplash(raidId) ?? "pantheonSplash"}
            backgroundImageAltText={`Splash for ${getActivityString(raidId)}`}>
            <HomeCardContentSection sectionTitle="World First Race">
                <HomeCardContentSectionItem
                    title={isReprised ? "Challenge" : "Normal"}
                    href={`/leaderboards/${raidUrlPath}/worldfirst`}
                />
                {isReprised && (
                    <HomeCardContentSectionItem
                        title="Normal"
                        href={`/leaderboards/${raidUrlPath}/first/normal`}
                    />
                )}
            </HomeCardContentSection>
            <HomeCardContentSection sectionTitle="Speedrun Leaderboards">
                {SpeedrunVariables[raidId]?.variable ? (
                    o.map(
                        SpeedrunVariables[raidId].variable!.values,
                        (type, data) =>
                            data && (
                                <HomeCardContentSectionItem
                                    key={data.id}
                                    title={data.displayName}
                                    href={`/leaderboards/${raidUrlPath}/speedrun/${type}`}
                                />
                            )
                    )
                ) : (
                    <HomeCardContentSectionItem
                        title="Any %"
                        href={`/leaderboards/${raidUrlPath}/speedrun/all`}
                    />
                )}
            </HomeCardContentSection>
            <HomeCardContentSection sectionTitle="Individual Leaderboards">
                {raidHubBoards.map(([displayName, path]) => (
                    <HomeCardContentSectionItem
                        key={displayName}
                        title={displayName}
                        href={`/leaderboards/${raidUrlPath}/individual/${path}`}
                    />
                ))}
            </HomeCardContentSection>
            {!!miscBoards.length && (
                <HomeCardContentSection sectionTitle="Miscellaneous">
                    {miscBoards.map(versionId => (
                        <HomeCardContentSectionItem
                            key={versionId}
                            title={getVersionString(versionId)}
                            href={`/leaderboards/${raidUrlPath}/first/${getUrlPathForVersion(
                                versionId
                            )}`}
                        />
                    ))}
                </HomeCardContentSection>
            )}
        </HomeCardGeneric>
    )
}
