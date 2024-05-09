import type { Metadata } from "next"
import { metadata as rootMetaData } from "~/app/layout"
import { PGCRPage } from "../PGCRPage"
import { getMetaData, prefetchActivity, type PageProps } from "./common"

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const preferredRegion = ["fra1"] // eu-central-1, Frankfurt, Germany

export default async function Page({ params }: PageProps) {
    const activity = await prefetchActivity(params.instanceId)

    return <PGCRPage instanceId={params.instanceId} ssrActivity={activity ?? undefined} isReady />
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const activity = await prefetchActivity(params.instanceId)

    if (!activity)
        return {
            robots: {
                follow: false,
                index: false
            }
        }

    const { title, description } = getMetaData(activity)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images, ...rootOG } = rootMetaData.openGraph!
    return {
        title: title,
        description: description,
        openGraph: {
            ...rootOG,
            title: title,
            description: description
        },
        twitter: {
            ...rootMetaData.twitter,
            card: "summary_large_image"
        },
        robots: {
            follow: true,
            // Only index top 25 pgcrs for any leaderboard
            index: Object.values(activity.leaderboardEntries).some(v => v <= 25)
        }
    }
}
