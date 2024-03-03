import { type Metadata } from "next"
import { metadata as leaderboardMetadata } from "~/app/layout"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import type { PageStaticParams } from "~/types/generic"
import { getRaidEnum } from "../../helpers"
import { type RaidLeaderboardStaticParams } from "../../layout"

export async function generateStaticParams({ params: { raid } }: RaidLeaderboardStaticParams) {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, raid)

    const wfBoards = manifest.leaderboards.worldFirst[raidEnum]

    return wfBoards.map(board => ({
        category: board.category
    }))
}

type StaticParams = RaidLeaderboardStaticParams & PageStaticParams<typeof generateStaticParams>

export async function generateMetadata({ params }: StaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, params.raid)

    const boards = manifest.leaderboards.worldFirst[raidEnum]
    const raidName = manifest.raidStrings[raidEnum]

    const title = `${raidName} ${
        boards.find(p => p.category === params.category)!.displayName
    } World First Leaderboard`
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
