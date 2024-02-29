"use client"

import RaidCardBackground from "data/raid-backgrounds"
import { Difficulty } from "~/data/raid"
import { SpeedrunVariables } from "~/data/speedrun-com-mappings"
import { useRaidHubManifest } from "~/layout/managers/RaidHubManifestManager"
import { type ListedRaid, type RaidHubManifestResponse } from "~/types/raidhub-api"
import { o } from "~/util/o"
import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { HomeCardContentSectionItem } from "./content/HomeCardContentSectionItem"

export const HomeCardRaid = ({
    raid,
    worldFirstLeaderboards,
    individualLeaderboards
}: {
    raid: ListedRaid
    worldFirstLeaderboards: RaidHubManifestResponse["leaderboards"]["worldFirst"][ListedRaid]
    individualLeaderboards: RaidHubManifestResponse["leaderboards"]["individual"]["clears"][ListedRaid]
}) => {
    const { getDifficultyString, getRaidString, getUrlPathForRaid } = useRaidHubManifest()
    const raidUrlPath = getUrlPathForRaid(raid)

    return (
        <HomeCardGeneric
            id={raidUrlPath}
            title={getRaidString(raid)}
            backgroundImageCloudflareId={RaidCardBackground[raid]}
            backgroundImageAltText={`Splash for ${getRaidString(raid)}`}>
            <HomeCardContentSection sectionTitle="World First Race">
                {worldFirstLeaderboards
                    .filter(b => b.category === "normal" || b.category === "challenge")
                    .sort(b => (b.category === "challenge" ? -1 : 1))
                    .map(b => (
                        <HomeCardContentSectionItem
                            key={b.id}
                            title={b.displayName}
                            href={`/leaderboards/${raidUrlPath}/worldfirst/${b.category}`}
                        />
                    ))}
            </HomeCardContentSection>
            <HomeCardContentSection sectionTitle="Individual Leaderboards">
                {individualLeaderboards.map(({ name, category }) => (
                    <HomeCardContentSectionItem
                        key={category}
                        title={name}
                        href={`/leaderboards/${raidUrlPath}/${category}`}
                    />
                ))}
            </HomeCardContentSection>
            <HomeCardContentSection sectionTitle="Speedrun Leaderboards">
                {SpeedrunVariables[raid] ? (
                    o.map(
                        SpeedrunVariables[raid]!.values,
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
                        title={`Any %`}
                        href={`/leaderboards/${raidUrlPath}/speedrun/all`}
                    />
                )}
            </HomeCardContentSection>
            {worldFirstLeaderboards.length > 1 && (
                <HomeCardContentSection sectionTitle="Misceallaneous">
                    {worldFirstLeaderboards.some(b => b.category === "master") && (
                        <HomeCardContentSectionItem
                            title={getDifficultyString(Difficulty.MASTER)}
                            href={`/leaderboards/${raidUrlPath}/worldfirst/master`}
                        />
                    )}
                    {worldFirstLeaderboards.some(b => b.category === "prestige") && (
                        <HomeCardContentSectionItem
                            title={getDifficultyString(Difficulty.PRESTIGE)}
                            href={`/leaderboards/${raidUrlPath}/worldfirst/prestige`}
                        />
                    )}
                </HomeCardContentSection>
            )}
        </HomeCardGeneric>
    )
}
