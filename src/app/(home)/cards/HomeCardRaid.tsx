"use client"

import { useMemo } from "react"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { RaidSplash } from "~/data/activity-images"
import { SpeedrunVariables } from "~/data/speedrun-com-mappings"
import { type ListedRaid } from "~/services/raidhub/types"
import { o } from "~/util/o"
import { HomeCardGeneric } from "./HomeCardGeneric"
import { HomeCardContentSection } from "./content/HomeCardContentSection"
import { HomeCardContentSectionItem } from "./content/HomeCardContentSectionItem"

const isWorldFirstBoard = (board: string) => board === "normal" || board === "challenge"

export const HomeCardRaid = ({ raid }: { raid: ListedRaid }) => {
    const { getRaidString, getUrlPathForRaid, leaderboards } = useRaidHubManifest()
    const raidUrlPath = getUrlPathForRaid(raid)

    const worldFirstLeaderboards = leaderboards.worldFirst[raid]

    const { worldFirstBoards, miscBoards } = useMemo(() => {
        const worldFirstBoards: [...typeof worldFirstLeaderboards] = []
        const miscBoards: [...typeof worldFirstLeaderboards] = []

        for (const board of worldFirstLeaderboards) {
            if (isWorldFirstBoard(board.category)) {
                worldFirstBoards.push(board)
            } else {
                miscBoards.push(board)
            }
        }

        return {
            worldFirstBoards: worldFirstBoards.sort(b => (b.category === "challenge" ? -1 : 1)),
            miscBoards
        }
    }, [worldFirstLeaderboards])

    return (
        <HomeCardGeneric
            id={raidUrlPath}
            title={getRaidString(raid)}
            backgroundImageCloudflareId={RaidSplash[raid]}
            backgroundImageAltText={`Splash for ${getRaidString(raid)}`}>
            <HomeCardContentSection sectionTitle="World First Race">
                {worldFirstBoards.map(b => (
                    <HomeCardContentSectionItem
                        key={b.id}
                        title={b.displayName}
                        href={`/leaderboards/${raidUrlPath}/worldfirst/${b.category}`}
                    />
                ))}
            </HomeCardContentSection>
            <HomeCardContentSection sectionTitle="Speedrun Leaderboards">
                {SpeedrunVariables[raid].variable ? (
                    o.map(
                        SpeedrunVariables[raid].variable!.values,
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
                <HomeCardContentSectionItem
                    title="Sherpas"
                    href={`/leaderboards/${raidUrlPath}/individual/sherpas`}
                />
                {leaderboards.individual.clears[raid].map(({ displayName, category }) => (
                    <HomeCardContentSectionItem
                        key={category}
                        title={`${displayName} Clears`}
                        href={`/leaderboards/${raidUrlPath}/individual/clears/${category}`}
                    />
                ))}
            </HomeCardContentSection>
            {!!miscBoards.length && (
                <HomeCardContentSection sectionTitle="Miscellaneous">
                    {miscBoards.map(b => (
                        <HomeCardContentSectionItem
                            key={b.id}
                            title={b.displayName}
                            href={`/leaderboards/${raidUrlPath}/worldfirst/${b.category}`}
                        />
                    ))}
                </HomeCardContentSection>
            )}
        </HomeCardGeneric>
    )
}
