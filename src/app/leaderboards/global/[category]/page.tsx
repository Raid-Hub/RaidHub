import { type Metadata } from "next"
import { metadata as rootMetadata } from "~/app/layout"
import { Flex } from "~/components/layout/Flex"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import type { PageStaticParams } from "~/types/generic"
import { Leaderboard } from "../../Leaderboard"
import { StaticLeaderboardControls } from "../../LeaderboardControls"
import { LeaderboardEntriesSuspense } from "../../LeaderboardEntriesSuspense"
import { GlobalEntriesBanner } from "./GlobalEntriesBanner"
import { GlobalSSREntries } from "./GlobalSSREntries"
import { ENTRIES_PER_PAGE, createQueryKey } from "./constants"

export async function generateStaticParams() {
    const manifest = await prefetchManifest()

    return manifest.leaderboards.global.map(board => ({
        category: board.category
    }))
}

type StaticParams = PageStaticParams<typeof generateStaticParams> & {
    searchParams: {
        page?: string
    }
}

export async function generateMetadata({ params }: StaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()

    const displayName = manifest.leaderboards.global.find(
        board => board.category === params.category
    )!.displayName

    const title = displayName + " Leaderboards"
    return {
        title: title,
        openGraph: {
            ...rootMetadata.openGraph,
            title: title
        }
    }
}

export default async function Page({ params, searchParams }: StaticParams) {
    const globalLeaderboards = await prefetchManifest().then(
        manifest => manifest.leaderboards.global
    )

    const { displayName, format } = globalLeaderboards.find(l => l.category === params.category)!

    return (
        <Leaderboard
            pageProps={{ format, type: "player", count: ENTRIES_PER_PAGE }}
            heading={
                <Flex $padding={0}>
                    <Flex $direction="column" $padding={0} $gap={0} style={{ flexBasis: "50%" }}>
                        <GlobalEntriesBanner category={params.category} title={displayName} />
                        <StaticLeaderboardControls
                            queryKey={createQueryKey({ page: 1, category: params.category })}
                        />
                    </Flex>
                </Flex>
            }
            entries={
                <LeaderboardEntriesSuspense>
                    <GlobalSSREntries category={params.category} page={searchParams.page ?? "1"} />
                </LeaderboardEntriesSuspense>
            }
        />
    )
}
