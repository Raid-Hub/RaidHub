import { type Metadata } from "next"
import { metadata as rootMetaData } from "~/app/layout"

export const generatePlayerMetadata = ({
    username,
    image
}: {
    username: string
    image: string
}): Metadata => {
    const description = `View ${username}'s raid stats, achievements, tags, and more`
    return {
        title: username,
        description,
        openGraph: {
            ...rootMetaData.openGraph,
            images: image,
            title: username,
            description
        },
        twitter: {
            ...rootMetaData.twitter,
            card: "summary_large_image",
            images: image
        }
    }
}
