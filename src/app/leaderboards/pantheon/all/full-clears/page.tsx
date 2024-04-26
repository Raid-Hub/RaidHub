import { type Metadata } from "next"
import { metadata as leaderboardMetadata } from "~/app/layout"
import { Leaderboard } from "../../../Leaderboard"
import { Splash } from "../../../LeaderboardSplashComponents"
import { ENTRIES_PER_PAGE, createIndividualQueryKey, getIndividualLeaderboard } from "../../common"
import { IndividualEntries } from "../IndividualEntries"

export async function generateMetadata(): Promise<Metadata> {
    const title = "The Pantheon Total Full Clears Leaderboard"
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

export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
    return (
        <Leaderboard
            pageProps={{ format: "number", type: "player", count: ENTRIES_PER_PAGE }}
            hasSearch={false}
            hasPages
            refreshQueryKey={createIndividualQueryKey({
                category: "total-clears",
                count: ENTRIES_PER_PAGE,
                page: 1
            })}
            heading={
                <Splash
                    title="Full Clears"
                    subtitle="The Pantheon"
                    tertiaryTitle="All Versions"
                    cloudflareImageId="pantheonSplash"
                />
            }
            entries={<SSREntries page={searchParams.page ?? "1"} />}
        />
    )
}

export const SSREntries = async (props: { page: string }) => {
    const ssrData =
        props.page === "1"
            ? await getIndividualLeaderboard({
                  category: "total-clears",
                  page: 1,
                  count: ENTRIES_PER_PAGE
              })
            : undefined

    return (
        <IndividualEntries
            category="total-clears"
            ssr={ssrData}
            ssrUpdatedAt={Date.now()}
            ssrPage={props.page}
        />
    )
}
