"use client"

import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import RaidCardBackground from "~/data/raid-backgrounds"
import { SpeedrunVariables, type RTABoardCategory } from "~/data/speedrun-com-mappings"
import { type ListedRaid } from "~/services/raidhub/types"
import { Splash } from "../../../SplashBannerComponents"

export const SpeedrunComBanner = (props: { raid: ListedRaid; category?: RTABoardCategory }) => {
    const { getRaidString } = useRaidHubManifest()

    const title = getRaidString(props.raid)
    const subtitle = props.category
        ? SpeedrunVariables[props.raid].variable?.values[props.category]?.displayName
        : undefined

    return (
        <Splash
            title={title}
            subtitle={subtitle}
            tertiaryTitle="Speedrun Leaderboards"
            cloudflareImageId={RaidCardBackground[props.raid]}
        />
    )
}
