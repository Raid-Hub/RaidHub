"use client"

import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { getRaidSplash } from "~/data/activity-images"
import { SpeedrunVariables, type RTABoardCategory } from "~/data/speedrun-com-mappings"
import { Splash } from "../../../../LeaderboardSplashComponents"

export const SpeedrunComBanner = (props: {
    raidId: number
    raidPath: string
    category?: RTABoardCategory
}) => {
    const { getActivityString } = useRaidHubManifest()

    const title = getActivityString(props.raidId)
    const subtitle = props.category
        ? SpeedrunVariables[props.raidPath].variable?.values[props.category]?.displayName
        : undefined

    return (
        <Splash
            title={title}
            subtitle={subtitle}
            tertiaryTitle="Speedrun Leaderboards"
            cloudflareImageId={getRaidSplash(props.raidId) ?? "pantheonSplash"}
        />
    )
}
