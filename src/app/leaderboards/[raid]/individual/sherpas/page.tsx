import { type Metadata } from "next"
import { prefetchManifest } from "~/app/layout"
import {
    getRaidEnum,
    metadata as leaderboardMetadata,
    type RaidLeaderboardStaticParams
} from "../../layout"

export async function generateMetadata({ params }: RaidLeaderboardStaticParams): Promise<Metadata> {
    const manifest = await prefetchManifest()
    const raidEnum = getRaidEnum(manifest, params.raid)

    const raidName = manifest.raidStrings[raidEnum]

    const title = `${raidName} Sherpas Leaderboard`
    return {
        title: title,
        openGraph: {
            ...leaderboardMetadata.openGraph,
            title: title
        }
    }
}

export default function Page({ params }: RaidLeaderboardStaticParams) {
    return <div>{JSON.stringify(params, null, 2)}</div>
}
