import Image, { type ImageLoader } from "next/image"
import { type ComponentPropsWithoutRef } from "react"

export function CloudflareImage({
    cloudflareId,
    alt = "",
    ...props
}: { cloudflareId: string } & Omit<ComponentPropsWithoutRef<typeof Image>, "src" | "loader">) {
    return <Image src={cloudflareId} alt={alt} loader={cloudflareImageLoader} {...props} />
}

const cloudflareVariants: { name: string; w: number; h: number }[] = [
    { name: "tiny", w: 320, h: 180 },
    {
        name: "small",
        w: 640,
        h: 360
    },
    {
        name: "medium",
        w: 1366,
        h: 768
    },
    {
        name: "large",
        w: 1920,
        h: 1080
    },
    {
        name: "xlarge",
        w: 2560,
        h: 1440
    }
]

const cloudflareId = "85AvSk7Z9-QdHfmk4t5dsw"

const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const minWidth = (width * (quality || 75)) / 100

    const variant = (
        cloudflareVariants.find(item => item.w >= minWidth) ??
        cloudflareVariants[cloudflareVariants.length - 1]
    ).name

    return `https://cdn.raidhub.io/cdn-cgi/imagedelivery/${cloudflareId}/${src}/${variant}`
}
