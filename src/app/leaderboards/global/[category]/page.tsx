import { type Metadata } from "next"
import { z } from "zod"
import { prefetchManifest, metadata as rootMetadata } from "~/app/layout"
import type { PageStaticParams } from "~/types/generic"
import { Leaderboard } from "../../Leaderboard"
import { GlobalEntries } from "./GlobalEntries"
import { GlobalEntriesBanner } from "./GlobalEntriesBanner"

export async function generateStaticParams() {
    const manifest = await prefetchManifest()

    return manifest.leaderboards.global.map(board => ({
        category: board.category
    }))
}

type StaticParams = PageStaticParams<typeof generateStaticParams>

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

export default async function Page({
    params,
    searchParams
}: StaticParams & {
    searchParams: {
        page: number
    }
}) {
    const pageParsed = z.number().int().positive().default(1).safeParse(searchParams.page)
    const globalLeaderboards = await prefetchManifest().then(
        manifest => manifest.leaderboards.global
    )

    const { displayName, format } = globalLeaderboards.find(l => l.category === params.category)!

    return (
        <Leaderboard
            pageProps={{ format }}
            heading={<GlobalEntriesBanner category={params.category} title={displayName} />}>
            <GlobalEntries
                category={params.category}
                page={pageParsed.success ? pageParsed.data : 1}
            />
        </Leaderboard>
    )
}
