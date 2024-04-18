import { type Metadata } from "next"
import { metadata as leaderboardMetadata } from "~/app/layout"
import { RaidSplash } from "~/data/activity-images"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import type { PageStaticParams } from "~/types/generic"
import { Leaderboard } from "../../../../Leaderboard"
import { Splash } from "../../../../LeaderboardSplashComponents"
import { getRaidEnum } from "../../../helpers"
import { type RaidLeaderboardStaticParams } from "../../../layout"
import { createQueryKey, ENTRIES_PER_PAGE } from "../../constants"
import { IndividualSSREntries } from "../../IndividualSSREntries"

export async function generateStaticParams({ params }: RaidLeaderboardStaticParams) {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, params.raid)

    const clearsBoards = manifest.leaderboards.individual.clears[raidEnum]

    return clearsBoards.map(board => ({
        category: board.category
    }))
}

type StaticParams = RaidLeaderboardStaticParams &
    PageStaticParams<typeof generateStaticParams> & { searchParams: { page: string } }

export async function generateMetadata({ params }: StaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, params.raid)
    const clearsBoards = manifest.leaderboards.individual.clears[raidEnum]

    const raidName = manifest.activityStrings[raidEnum]

    const title = `${raidName} ${
        clearsBoards.find(p => p.category === params.category)!.displayName
    } Clears Leaderboard`
    return {
        title: title,
        openGraph: {
            ...leaderboardMetadata.openGraph,
            title: title
        }
    }
}

export const revalidate = 900
export const dynamic = "force-static"
export const preferredRegion = ["fra1"] // eu-central-1, Frankfurt, Germany

export default async function Page({ params, searchParams }: StaticParams) {
    const manifest = await prefetchManifest()
    const raid = getRaidEnum(manifest, params.raid)

    const { displayName } = manifest.leaderboards.individual.clears[raid].find(
        l => l.category === params.category
    )!

    return (
        <Leaderboard
            pageProps={{ format: "number", type: "player", count: ENTRIES_PER_PAGE }}
            type="individual"
            category={params.category}
            hasPages
            raid={raid}
            refreshQueryKey={createQueryKey({
                raidPath: params.raid,
                category: params.category,
                page: 1
            })}
            heading={
                <Splash
                    title={`${displayName} Clears`}
                    subtitle={manifest.activityStrings[raid]}
                    tertiaryTitle="Individual Leaderboards"
                    cloudflareImageId={RaidSplash[raid]}
                />
            }
            entries={
                <IndividualSSREntries
                    category={params.category}
                    page={searchParams.page ?? "1"}
                    raidPath={params.raid}
                />
            }
        />
    )
}
