"use client"

import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { Grid } from "~/components/layout/Grid"
import { HomeCardGlobal } from "./cards/HomeCardGlobal"
import { HomeCardPantheon } from "./cards/HomeCardPantheon"
import { HomeCardRaid } from "./cards/HomeCardRaid"

export const Cards = () => {
    const { listedRaids } = useRaidHubManifest()

    return (
        <Grid $minCardWidth={320} $gap={1.5}>
            <HomeCardGlobal />
            {listedRaids.map(raidId => (
                <HomeCardRaid key={raidId} raidId={raidId} />
            ))}
            <HomeCardPantheon />
        </Grid>
    )
}
