import { type Metadata } from "next"
import RaidCardBackground from "~/data/raid-backgrounds"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { Leaderboard } from "../../../Leaderboard"
import { Splash } from "../../../LeaderboardSplashComponents"
import { getRaidEnum } from "../../helpers"
import { metadata as leaderboardMetadata, type RaidLeaderboardStaticParams } from "../../layout"
import { createQueryKey, ENTRIES_PER_PAGE } from "../constants"
import { IndividualSSREntries } from "../IndividualSSREntries"

type StaticParams = RaidLeaderboardStaticParams & { searchParams: { page?: string } }

export async function generateMetadata({ params }: StaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, params.raid)

    const raidName = manifest.raidStrings[raidEnum]

    const title = `${raidName} Sherpa Leaderboard`
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

    return (
        <Leaderboard
            pageProps={{ format: "number", type: "player", count: ENTRIES_PER_PAGE }}
            type="individual"
            category="sherpas"
            hasPages
            raid={raid}
            refreshQueryKey={createQueryKey({
                raidPath: params.raid,
                category: "sherpas",
                page: 1
            })}
            heading={
                <Splash
                    title="Sherpas"
                    subtitle={manifest.raidStrings[raid]}
                    tertiaryTitle="Individual Leaderboards"
                    cloudflareImageId={RaidCardBackground[raid]}
                />
            }
            entries={
                <IndividualSSREntries
                    category="sherpas"
                    page={searchParams.page ?? "1"}
                    raidPath={params.raid}
                />
            }
        />
    )
}
