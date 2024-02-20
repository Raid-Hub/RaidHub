"use client"

import RaidCardBackground from "data/raid-backgrounds"
import { Difficulty } from "~/data/raid"
import { SpeedrunVariables, type RTABoard } from "~/data/speedrun-com-mappings"
import { rtaLeaderboardNames } from "~/data/strings/rta-speedrun-names"
import { useRaidHubManifest } from "~/layout/managers/RaidHubManifestManager"
import { type ListedRaid, type RaidHubManifestResponse } from "~/types/raidhub-api"
import { o } from "~/util/o"
import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { HomeCardContentSectionItem } from "./content/HomeCardContentSectionItem"

export const HomeCardraid = ({
    raid,
    worldFirstLeaderboards,
    individualLeaderboards
}: {
    raid: ListedRaid
    worldFirstLeaderboards: RaidHubManifestResponse["leaderboards"]["worldFirst"][ListedRaid]
    individualLeaderboards: RaidHubManifestResponse["leaderboards"]["individual"][ListedRaid]
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
                <HomeCardContentSectionItem
                    title={
                        worldFirstLeaderboards.some(b => b.type === "challenge")
                            ? "Challenge"
                            : "Normal"
                    }
                    href={`/leaderboards/${raidUrlPath}/worldfirst`}
                />
                {worldFirstLeaderboards.some(b => b.type === "challenge") && (
                    <HomeCardContentSectionItem
                        title="Normal"
                        href={`/leaderboards/${raidUrlPath}/first/normal`}
                    />
                )}
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
            <HomeCardContentSection sectionTitle="RTA Speedrun Leaderboards">
                {o.map(
                    (SpeedrunVariables[raid]?.values ?? {}) as Record<
                        string,
                        {
                            id: string
                            name: RTABoard
                        }
                    >,
                    (type, { id, name }) => (
                        <HomeCardContentSectionItem
                            key={id}
                            title={rtaLeaderboardNames[name]}
                            href={`/leaderboards/${raidUrlPath}/src/${encodeURIComponent(type)}`}
                        />
                    )
                )}
            </HomeCardContentSection>
            {worldFirstLeaderboards.length > 1 && (
                <HomeCardContentSection sectionTitle="Misceallaneous">
                    {worldFirstLeaderboards.some(b => b.type === "master") && (
                        <HomeCardContentSectionItem
                            title={getDifficultyString(Difficulty.MASTER)}
                            href={`/leaderboards/${raidUrlPath}/first/master`}
                        />
                    )}
                    {worldFirstLeaderboards.some(b => b.type === "prestige") && (
                        <HomeCardContentSectionItem
                            title={getDifficultyString(Difficulty.PRESTIGE)}
                            href={`/leaderboards/${raidUrlPath}/first/prestige`}
                        />
                    )}
                </HomeCardContentSection>
            )}
        </HomeCardGeneric>
    )
}
