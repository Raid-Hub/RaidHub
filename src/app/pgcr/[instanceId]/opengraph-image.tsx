import { ImageResponse } from "next/og"
import { prefetchManifest } from "~/services/raidhub/prefetchRaidHubManifest"
import { prefetchActivity } from "./common"

export const runtime = "nodejs"

const size = {
    width: 1200,
    height: 640
}

export async function generateImageMetadata({ params }: { params: { instanceId: string } }) {
    const [activity, manifest] = await Promise.all([
        prefetchActivity(params.instanceId),
        prefetchManifest()
    ])

    if (!activity) return []

    const raidName = manifest.raidStrings[activity.meta.raid]

    return [
        {
            id: 0,
            alt: raidName,
            contentType: "image/png",
            size,
            activity,
            raidName
        }
    ]
}

// Image generation
export default async function Image({
    activity,
    raidName
}: Awaited<ReturnType<typeof generateImageMetadata>>[number]) {
    // const font = fetch(
    //     "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2",
    //     {
    //         next: {
    //             revalidate: 60 * 60 * 24 // 24 hours
    //         }
    //     }
    // ).then(res => res.arrayBuffer())

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 128,
                    background: "white",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                {raidName}
            </div>
            // {
            //     status: 200,
            //     fonts: [
            //         {
            //             name: "Inter",
            //             data: await font,
            //             style: "normal",
            //             weight: 400
            //         }
            //     ]
            // }
        )
    )
}
