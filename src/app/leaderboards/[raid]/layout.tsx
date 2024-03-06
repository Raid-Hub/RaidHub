import { type Metadata } from "next"
import { type ReactNode } from "react"
import { metadata as rootMetadata } from "~/app/layout"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import type { PageStaticParams } from "~/types/generic"
import { o } from "~/util/o"

export async function generateStaticParams() {
    const raidUrlPaths = await prefetchManifest().then(manifest => manifest.raidUrlPaths)

    return o.map(raidUrlPaths, (_, urlPath) => ({
        raid: urlPath
    }))
}

export type RaidLeaderboardStaticParams = PageStaticParams<typeof generateStaticParams>

export default function Layout({
    children
}: RaidLeaderboardStaticParams & { children: ReactNode }) {
    return children
}

export const metadata: Metadata = {
    // TODO we can add generic leaderboard metadata here
    openGraph: {
        ...rootMetadata.openGraph
    }
}
