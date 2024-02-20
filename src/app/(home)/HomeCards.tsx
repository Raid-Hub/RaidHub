"use client"

import { Grid } from "~/components/layout/Grid"
import { useRaidHubManifest } from "~/layout/managers/RaidHubManifestManager"
import { HomeCardGlobal } from "./cards/HomeCardGlobal"
import { HomeCardraid } from "./cards/HomeCardRaid"

export const Cards = () => {
    const { listedRaids, leaderboards } = useRaidHubManifest()

    return (
        <Grid $minCardWidth={320} $gap={1.5}>
            <HomeCardGlobal />
            {listedRaids.map(raid => (
                <HomeCardraid
                    key={raid}
                    raid={raid}
                    worldFirstLeaderboards={leaderboards.worldFirst[raid] ?? []}
                    individualLeaderboards={leaderboards.individual[raid] ?? {}}
                />
            ))}
        </Grid>
    )
}
