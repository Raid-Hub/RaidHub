import type { Metadata } from "next"
import { metadata as rootMetaData } from "~/app/layout"
import { PGCRPage } from "../PGCRPage"
import { getMetaData, prefetchActivity, type PageProps } from "./common"

export const revalidate = 0

export default async function Page({ params }: PageProps) {
    const activity = await prefetchActivity(params.instanceId)

    return <PGCRPage instanceId={params.instanceId} ssrActivity={activity} isReady={true} />
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const activity = await prefetchActivity(params.instanceId)

    const { idTitle, ogTitle, description } = getMetaData(activity)

    const inheritedOpengraph = structuredClone(rootMetaData.openGraph)
    // Remove images from inherited metadata, otherwise it overrides the image generated
    // by the dynamic image generator
    delete inheritedOpengraph.images

    return {
        title: idTitle,
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
            title: ogTitle,
            description: description
        },
        twitter: {
            ...rootMetaData.twitter,
            card: "summary_large_image"
        },
        robots: {
            follow: true,
            // Only index lowmans, flawlesses, and placements
            index:
                !!activity.leaderboardRank ||
                !!activity.flawless ||
                (activity.completed && activity.playerCount <= 3)
        }
    }
}
