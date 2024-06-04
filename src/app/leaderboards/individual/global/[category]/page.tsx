import { type Metadata } from "next"
import { metadata as rootMetadata } from "~/app/layout"
import { type PathParamsForLeaderboardURL } from "~/services/raidhub/types"
import { Leaderboard } from "../../../Leaderboard"
import { LeaderboardSSR } from "../../../LeaderboardSSR"
import { Splash } from "../../../LeaderboardSplashComponents"

export const dynamicParams = true
export const revalidate = 900
export const dynamic = "force-static"
export const preferredRegion = ["fra1"] // eu-central-1, Frankfurt, Germany

const getCategoryName = (category: DynamicParams["params"]["category"]) => {
    switch (category) {
        case "clears":
            return "Clears"
        case "freshClears":
            return "Full Clears"
        case "sherpas":
            return "Sherpas"
        case "speedrun":
            return "Speedrun"
        default:
            return "Unknown Category"
    }
}

type DynamicParams = {
    params: PathParamsForLeaderboardURL<"/leaderboard/individual/global/{category}">
    searchParams: Record<string, string>
}

export async function generateMetadata({ params }: DynamicParams): Promise<Metadata> {
    const title = getCategoryName(params.category) + " Leaderboards"
    return {
        title: title,
        openGraph: {
            ...rootMetadata.openGraph,
            title: title
        }
    }
}

const ENTRIES_PER_PAGE = 50

export default async function Page({ params, searchParams }: DynamicParams) {
    const categoryName = getCategoryName(params.category)

    return (
        <Leaderboard
            pageProps={{
                entriesPerPage: ENTRIES_PER_PAGE,
                layout: "individual",
                queryKey: ["raidhub", "leaderboard", "global", params.category],
                apiUrl: "/leaderboard/individual/global/{category}",
                params
            }}
            hasSearch
            hasPages
            external={false}
            heading={
                <Splash
                    title={categoryName}
                    tertiaryTitle="Global Leaderboards"
                    cloudflareImageId="raidhubCitySplash"
                />
            }
            entries={
                <LeaderboardSSR
                    page={searchParams.page ?? "1"}
                    entriesPerPage={ENTRIES_PER_PAGE}
                    apiUrl="/leaderboard/individual/global/{category}"
                    params={params}
                />
            }
        />
    )
}
