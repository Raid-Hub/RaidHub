"use client"

import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { Grid } from "~/components/layout/Grid"
import { HomeCardGlobal } from "./cards/HomeCardGlobal"
import { HomeCardRaid } from "./cards/HomeCardRaid"

export const Cards = () => {
    const { listedRaids } = useRaidHubManifest()

    return (
        <Grid $minCardWidth={320} $gap={1.5}>
            <HomeCardGlobal />
            {listedRaids.map(raid => (
                <HomeCardRaid key={raid} raid={raid} />
            ))}
        </Grid>
    )
}
