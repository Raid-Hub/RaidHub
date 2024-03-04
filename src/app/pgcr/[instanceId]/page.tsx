import type { Metadata } from "next"
import { metadata as rootMetaData } from "~/app/layout"
import { Tag } from "~/models/tag"
import { getRaidHubApi } from "~/services/raidhub/common"
import { PGCRPage } from "../PGCRPage"

type PageProps = {
    params: {
        instanceId: string
    }
}

export const dynamic = "force-static"
export const dynamicParams = true

export default async function Page({ params }: PageProps) {
    const activity = await prefetchActivity(params.instanceId)

    return <PGCRPage instanceId={params.instanceId} ssrActivity={activity ?? undefined} isReady />
}

const prefetchActivity = async (instanceId: string) =>
    getRaidHubApi("/activity/{instanceId}", { instanceId }, null).catch(() => null)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const activity = await prefetchActivity(params.instanceId)

    if (!activity) return {}

    const title = [
        activity.completed
            ? activity.playerCount === 1
                ? Tag.SOLO
                : activity.playerCount === 2
                ? Tag.DUO
                : activity.playerCount === 3
                ? Tag.TRIO
                : null
            : null,
        activity.flawless ? "Flawless" : null,
        activity.meta.raidName,
        `(${activity.meta.versionName})`
    ]
        .filter(Boolean)
        .join(" ")

    const dateCompleted = new Date(activity.dateCompleted)

    const description = `${
        activity.completed
            ? activity.fresh == false
                ? "Checkpoint cleared on"
                : "Completed on"
            : "Attempted on"
    } ${dateCompleted.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",

        timeZone: "America/Los_Angeles",
        timeZoneName: "short"
    })}`

    return {
        title: title,
        description: description,
        openGraph: {
            ...rootMetaData.openGraph,
            title: title,
            description: description
        }
    }
}
