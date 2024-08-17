import type { Metadata } from "next"
import { metadata as rootMetaData } from "~/app/layout"
import { PGCRPage } from "../PGCRPage"
import { getMetaData, prefetchActivity, type PageProps } from "./common"

export const dynamic = "force-dynamic"
export const preferredRegion = ["fra1"] // eu-central-1, Frankfurt, Germany
export const revalidate = false

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

    const inheritedOpengraph = structuredClone(rootMetaData.openGraph)
    // Remove images from inherited metadata, otherwise it overrides the image generated
    // by the dynamic image generator
    delete inheritedOpengraph.images

    return {
        title: title,
        description: description,
        keywords: [
            ...rootMetaData.keywords,
            "pgcr",
            "activity",
            activity.completed ? "clear" : "attempt",
            activity.leaderboardRank ? `#${activity.leaderboardRank}` : null,
            activity.metadata.activityName,
            activity.metadata.versionName,
            ...activity.players
                .slice(0, 6)
                .map(p => p.playerInfo.bungieGlobalDisplayName ?? p.playerInfo.displayName),
            "dot",
            "placement"
        ].filter(Boolean) as string[],
        openGraph: {
            ...inheritedOpengraph,
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
            index: activity.leaderboardRank ? activity.leaderboardRank <= 25 : false
        }
    }
}
