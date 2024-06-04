import { type Metadata } from "next"
import { metadata as leaderboardMetadata } from "~/app/layout"
import { LeaderboardSSR } from "~/app/leaderboards/LeaderboardSSR"
import { getRaidSplash } from "~/data/activity-images"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { type PathParamsForLeaderboardURL } from "~/services/raidhub/types"
import { Leaderboard } from "../../../Leaderboard"
import { Splash } from "../../../LeaderboardSplashComponents"
import { getRaidDefinition } from "../../../util"

export const dynamicParams = true
export const revalidate = 900
export const dynamic = "force-static"
export const preferredRegion = ["fra1"] // eu-central-1, Frankfurt, Germany

type DynamicParams = {
    params: PathParamsForLeaderboardURL<"/leaderboard/team/contest/{raid}">
    searchParams: Record<string, string>
}

export async function generateMetadata({ params }: DynamicParams): Promise<Metadata> {
    const manifest = await prefetchManifest()
    const definition = getRaidDefinition(params.raid, manifest)

    const title = `${definition.name} World First Leaderboard`
    return {
        title: title,
        openGraph: {
            ...leaderboardMetadata.openGraph,
            title: title
        }
    }
}

export default async function Page({ params, searchParams }: DynamicParams) {
    const manifest = await prefetchManifest()
    const definition = getRaidDefinition(params.raid, manifest)

    return (
        <Leaderboard
            heading={
                <Splash
                    title={definition.name}
                    subtitle={
                        manifest.resprisedRaidIds.includes(definition.id) ? "Challenge" : "Normal"
                    }
                    tertiaryTitle="World First Leaderboards"
                    cloudflareImageId={getRaidSplash(definition.path) ?? "pantheonSplash"}
                />
            }
            hasPages
            hasSearch
            external={false}
            pageProps={{
                layout: "team",
                queryKey: ["raidhub", "leaderboard", "worldfirst", params.raid],
                entriesPerPage: 50,
                apiUrl: "/leaderboard/team/contest/{raid}",
                params
            }}
            entries={
                <LeaderboardSSR
                    page={searchParams.page ?? "1"}
                    entriesPerPage={50}
                    apiUrl="/leaderboard/team/contest/{raid}"
                    params={params}
                />
            }
        />
    )
}
