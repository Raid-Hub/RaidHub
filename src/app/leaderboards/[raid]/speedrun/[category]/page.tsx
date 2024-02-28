import { type Metadata } from "next"
import { prefetchManifest } from "~/app/layout"
import { PageWrapper } from "~/components/layout/PageWrapper"
import { SpeedrunVariables, type RTABoardCategory } from "~/data/speedrun-com-mappings"
import { getSpeedrunComLeaderboard } from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import type { PageStaticParams } from "~/types/generic"
import {
    getRaidEnum,
    metadata as leaderboardMetadata,
    type RaidLeaderboardStaticParams
} from "../../layout"

export async function generateStaticParams({ params: { raid } }: RaidLeaderboardStaticParams) {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, raid)

    const data = SpeedrunVariables[raidEnum]
    if (data === undefined) return []
    else if (data === null)
        return [
            {
                category: "all" as RTABoardCategory
            }
        ]
    else
        return Object.keys(data.values).map(key => ({
            category: key as RTABoardCategory
        }))
}

type StaticParams = RaidLeaderboardStaticParams & PageStaticParams<typeof generateStaticParams>

export async function generateMetadata({ params }: StaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()

    const raidEnum = getRaidEnum(manifest, params.raid)
    const raidName = manifest.raidStrings[raidEnum]
    const displayName =
        params.category !== "all"
            ? SpeedrunVariables[raidEnum]?.values[params.category]?.displayName ?? null
            : null

    const title = [raidName, displayName, "Leaderboards"].filter(Boolean).join(" ")
    return {
        title: title,
        openGraph: {
            ...leaderboardMetadata.openGraph,
            title: title
        }
    }
}

export default async function Page({ params }: StaticParams) {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, params.raid)

    const results = await getSpeedrunComLeaderboard(
        { raid: raidEnum, category: params.category },
        {
            next: {
                revalidate: 7200
            }
        }
    )

    return (
        <PageWrapper>
            <div>{JSON.stringify(params, null, 2)}</div>
            <div>{JSON.stringify(results, null, 2)}</div>
        </PageWrapper>
    )
}
