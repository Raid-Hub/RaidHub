import { type Metadata } from "next"
import { Suspense } from "react"
import { prefetchManifest } from "~/app/layout"
import { Loading } from "~/components/Loading"
import { Flex } from "~/components/layout/Flex"
import { SpeedrunVariables, type RTABoardCategory } from "~/data/speedrun-com-mappings"
import type { PageStaticParams } from "~/types/generic"
import { Leaderboard } from "../../../Leaderboard"
import {
    getRaidEnum,
    metadata as leaderboardMetadata,
    type RaidLeaderboardStaticParams
} from "../../layout"
import { SpeedrunComBanner } from "./SpeedrunComBanner"
import { SpeedrunEntries } from "./SpeedrunEntries"

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

export default async function Page({ params }: StaticSpeedrunLeaderboardParams) {
    const manifest = await prefetchManifest()

    const raid = getRaidEnum(manifest, params.raid)
    const category = params.category === "all" ? undefined : params.category

    return (
        <Leaderboard
            heading={
                <SpeedrunComBanner
                    raid={raid}
                    title={manifest.raidStrings[raid]}
                    subtitle={
                        category
                            ? SpeedrunVariables[raid].variable?.values[category]?.displayName
                            : undefined
                    }
                    category={category}
                />
            }>
            <Suspense
                fallback={
                    <Flex $fullWidth $padding={0}>
                        <Flex $direction="column" style={{ maxWidth: "900px" }} $padding={0}>
                            {Array.from({ length: 10 }, (_, idx) => (
                                <Loading
                                    key={idx}
                                    $minHeight="150px"
                                    $minWidth="800px"
                                    $alpha={0.8}
                                />
                            ))}
                        </Flex>
                    </Flex>
                }>
                <SpeedrunEntries raid={raid} category={category} />
            </Suspense>
        </Leaderboard>
    )
}
