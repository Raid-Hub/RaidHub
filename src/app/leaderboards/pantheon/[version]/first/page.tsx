import { type Metadata } from "next"
import { metadata as leaderboardMetadata } from "~/app/layout"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { Leaderboard } from "../../../Leaderboard"
import { Splash } from "../../../LeaderboardSplashComponents"
import {
    ENTRIES_PER_PAGE,
    createTeamQueryKey,
    getPantheonVersion,
    type PantheonVersionLeaderboardStaticParams
} from "../../common"
import { SSREntries } from "../TeamSSREntries"

export async function generateMetadata({
    params
}: PantheonVersionLeaderboardStaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()
    const versionEnum = getPantheonVersion(params.version, manifest)

    const title = `The Pantheon: ${manifest.versionStrings[versionEnum]} First Completion Leaderboard`
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

export default async function Page({
    params,
    searchParams
}: PantheonVersionLeaderboardStaticParams) {
    const manifest = await prefetchManifest()
    const pantheonVersion = getPantheonVersion(params.version, manifest)

    const { displayName } = manifest.leaderboards.pantheon.first.find(
        l => l.versionId === pantheonVersion
    )!

    return (
        <Leaderboard
            pageProps={{ format: "time", type: "team", count: ENTRIES_PER_PAGE }}
            hasSearch={false}
            hasPages
            refreshQueryKey={createTeamQueryKey({
                category: "first",
                pantheonPath: params.version,
                count: ENTRIES_PER_PAGE,
                page: 1
            })}
            heading={
                <Splash
                    tertiaryTitle="The Pantheon"
                    title={displayName}
                    subtitle="First Completion Leaderboard"
                    cloudflareImageId="pantheonSplash"
                />
            }
            entries={
                <SSREntries
                    category="first"
                    version={params.version}
                    page={searchParams.page ?? "1"}
                />
            }
        />
    )
}
