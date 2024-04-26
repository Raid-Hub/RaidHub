import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { metadata as leaderboardMetadata } from "~/app/layout"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { type RaidHubIndividualLeaderboardCategory } from "~/services/raidhub/types"
import { type PageStaticParams } from "~/types/generic"
import { Leaderboard } from "../../../Leaderboard"
import { Splash } from "../../../LeaderboardSplashComponents"
import { ENTRIES_PER_PAGE, createIndividualQueryKey, getIndividualLeaderboard } from "../../common"
import { IndividualEntries } from "../IndividualEntries"

export async function generateStaticParams() {
    const manifest = await prefetchManifest()

    return manifest.leaderboards.pantheon.individual.map(board => ({
        category: board.category
    }))
}

type StaticParams = PageStaticParams<typeof generateStaticParams> & {
    searchParams: {
        page?: string
    }
}

export async function generateMetadata({ params: { category } }: StaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()

    const displayName = manifest.leaderboards.pantheon.individual.find(
        board => board.category === category
    )?.displayName
    if (!displayName) {
        return notFound()
    }

    const title = `The Pantheon Total ${displayName} Leaderboard`
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

export default async function Page({ searchParams, params }: StaticParams) {
    const manifest = await prefetchManifest()

    const displayName = manifest.leaderboards.pantheon.individual.find(
        board => board.category === params.category
    )?.displayName
    if (!displayName) {
        return notFound()
    }

    return (
        <Leaderboard
            pageProps={{ format: "number", type: "player", count: ENTRIES_PER_PAGE }}
            hasSearch={false}
            hasPages
            refreshQueryKey={createIndividualQueryKey({
                category: params.category,
                count: ENTRIES_PER_PAGE,
                page: 1
            })}
            heading={
                <Splash
                    title={displayName}
                    subtitle="The Pantheon"
                    tertiaryTitle="All Versions"
                    cloudflareImageId="pantheonSplash"
                />
            }
            entries={<SSREntries page={searchParams.page ?? "1"} category={params.category} />}
        />
    )
}

const SSREntries = async (props: {
    page: string
    category: RaidHubIndividualLeaderboardCategory
}) => {
    const ssrData =
        props.page === "1"
            ? await getIndividualLeaderboard({
                  category: props.category,
                  page: 1,
                  count: ENTRIES_PER_PAGE
              })
            : undefined

    return (
        <IndividualEntries
            category={props.category}
            ssr={ssrData}
            ssrUpdatedAt={Date.now()}
            ssrPage={props.page}
        />
    )
}
