import { type Metadata } from "next"
import { type ReactNode } from "react"
import { prefetchManifest } from "~/app/layout"
import type { PageStaticParams } from "~/types/generic"
import type { ListedRaid, RaidHubManifest } from "~/types/raidhub-api"
import { o } from "~/util/o"

export async function generateStaticParams() {
    const raidUrlPaths = await prefetchManifest().then(manifest => manifest.raidUrlPaths)

    return o.map(raidUrlPaths, (_, urlPath) => ({
        raid: urlPath
    }))
}

export const getRaidEnum = (manifest: RaidHubManifest, urlPath: string) =>
    Number(
        o
            .entries(manifest.raidUrlPaths)
            .find(([_, manifestUrlPath]) => urlPath === manifestUrlPath)![0]
    ) as ListedRaid

export type RaidLeaderboardStaticParams = PageStaticParams<typeof generateStaticParams>

export default function Layout({
    children
}: RaidLeaderboardStaticParams & { children: ReactNode }) {
    return children
}

export const metadata: Metadata = {
    // TODO we can add generic leaderboard metadata here
}
