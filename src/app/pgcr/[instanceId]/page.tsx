import type { Metadata } from "next"
import { metadata as rootMetaData } from "~/app/layout"
import { PGCRPage } from "../PGCRPage"
import { getMetaData, prefetchActivity, type PageProps } from "./common"

export const dynamic = "force-static"
export const dynamicParams = true

export default async function Page({ params }: PageProps) {
    const activity = await prefetchActivity(params.instanceId)

    return <PGCRPage instanceId={params.instanceId} ssrActivity={activity ?? undefined} isReady />
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const activity = await prefetchActivity(params.instanceId)

    if (!activity) return {}

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
        }
    }
}
