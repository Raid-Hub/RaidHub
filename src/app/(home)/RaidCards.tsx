"use client"

import { HomeGlobal } from "components_old/home/HomeGlobal"
import { HomeRaidCard } from "components_old/home/HomeRaidCard"
import { useRaidHubManifest } from "~/app/managers/RaidHubManifestManager"
import { Grid } from "~/components/layout/Grid"

export const RaidCards = () => {
    const { listedRaids, leaderboards } = useRaidHubManifest()
    return (
        <Grid $minCardWidth={300} $gap={1.5}>
            <HomeGlobal />
            {listedRaids.map(raid => (
                <HomeRaidCard
                    raid={raid}
                    key={raid}
                    worldFirstLeaderboards={leaderboards.worldFirst[raid] ?? []}
                    individualLeaderboards={leaderboards.individual[raid] ?? {}}
                />
            ))}
        </Grid>
    )
}
