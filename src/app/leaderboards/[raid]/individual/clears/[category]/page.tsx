import { type Metadata } from "next"
import { metadata as leaderboardMetadata } from "~/app/layout"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import type { PageStaticParams } from "~/types/generic"
import { getRaidEnum } from "../../../helpers"
import { type RaidLeaderboardStaticParams } from "../../../layout"

export async function generateStaticParams({ params }: RaidLeaderboardStaticParams) {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, params.raid)

    const clearsBoards = manifest.leaderboards.individual.clears[raidEnum]

    return clearsBoards.map(board => ({
        category: board.category
    }))
}

type StaticParams = RaidLeaderboardStaticParams & PageStaticParams<typeof generateStaticParams>

export async function generateMetadata({ params }: StaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, params.raid)
    const clearsBoards = manifest.leaderboards.individual.clears[raidEnum]

    const raidName = manifest.raidStrings[raidEnum]

    const title = `${raidName} ${
        clearsBoards.find(p => p.category === params.category)!.name
    } Leaderboard`
    return {
        title: title,
        openGraph: {
            ...leaderboardMetadata.openGraph,
            title: title
        }
    }
}

export default function Page({ params }: StaticParams) {
    return <div>{JSON.stringify(params, null, 2)}</div>
}
