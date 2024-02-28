import { type Metadata } from "next"
import { prefetchManifest, metadata as rootMetadata } from "~/app/layout"
import type { PageStaticParams } from "~/types/generic"

export async function generateStaticParams() {
    const globalBoards = await prefetchManifest().then(manifest => manifest.leaderboards.global)

    return globalBoards.map(board => ({
        category: board.category
    }))
}

type Params = PageStaticParams<typeof generateStaticParams>

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const manifest = await prefetchManifest()

    const boardName = manifest.leaderboards.global.find(
        board => board.category === params.category
    )!.displayName

    const title = `${boardName} Leaderboard`
    return {
        title: title,
        openGraph: {
            ...rootMetadata.openGraph,
            title: title
        }
    }
}

export default function Page({ params }: Params) {
    return <div>{JSON.stringify(params, null, 2)}</div>
}
