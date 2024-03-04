import { type Metadata } from "next"
import { SpeedrunVariables, type RTABoardCategory } from "~/data/speedrun-com-mappings"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import type { PageStaticParams } from "~/types/generic"
import { Leaderboard } from "../../../Leaderboard"
import { getRaidEnum } from "../../helpers"
import { metadata as leaderboardMetadata, type RaidLeaderboardStaticParams } from "../../layout"
import { SpeedrunComBanner } from "./SpeedrunComBanner"
import { SpeedrunComControls } from "./SpeedrunComControls"
import { SpeedrunSSREntries } from "./SpeedrunSSREntries"

export async function generateStaticParams({ params: { raid } }: RaidLeaderboardStaticParams) {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, raid)

    const data = SpeedrunVariables[raidEnum]
    if (!data.variable) {
        return [
            {
                category: "all" as const
            }
        ]
    } else {
        return Object.keys(data.variable.values).map(key => ({
            category: key as RTABoardCategory
        }))
    }
}

type StaticSpeedrunLeaderboardParams = RaidLeaderboardStaticParams &
    PageStaticParams<typeof generateStaticParams>

export async function generateMetadata({
    params
}: StaticSpeedrunLeaderboardParams): Promise<Metadata> {
    const manifest = await prefetchManifest()

    const raidEnum = getRaidEnum(manifest, params.raid)
    const raidName = manifest.raidStrings[raidEnum]
    const displayName =
        params.category !== "all"
            ? SpeedrunVariables[raidEnum]?.variable?.values[params.category]?.displayName ?? null
            : null

    const title = [raidName, displayName, "Speedrun Leaderboards"].filter(Boolean).join(" ")
    return {
        title: title,
        openGraph: {
            ...leaderboardMetadata.openGraph,
            title: title
        }
    }
}

export const revalidate = 1800
export const dynamic = "force-static"

export default async function Page({ params }: StaticSpeedrunLeaderboardParams) {
    const manifest = await prefetchManifest()

    const raid = getRaidEnum(manifest, params.raid)
    const category = params.category === "all" ? undefined : params.category

    return (
        <Leaderboard
            pageProps={{ format: "time", type: "team", count: 50 }}
            hasPages={false}
            refreshQueryKey={["speedrun-com", "leaderboard", raid, category]}
            heading={<SpeedrunComBanner raid={raid} category={category} />}
            extraControls={<SpeedrunComControls raid={raid} category={category} />}
            entries={<SpeedrunSSREntries raid={raid} category={category} />}
        />
    )
}
