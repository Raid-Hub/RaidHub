import Image, { ImageLoader } from "next/image"
import { ComponentPropsWithoutRef } from "react"

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

const cloudflareImageLoader: ImageLoader = ({ src, width, quality }) => {
    const minWidth = (width * (quality || 75)) / 100

    console.log({ src, width, quality })
    const variant = (
        cloudflareVariants.find(item => item.w >= minWidth) ??
        cloudflareVariants[cloudflareVariants.length - 1]
    ).name

    return `https://cdn.raidhub.app/cdn-cgi/imagedelivery/85AvSk7Z9-QdHfmk4t5dsw/${src}/${variant}`
}

export default function CloudflareImage({
    cloudflareId,
    alt,
    ...props
}: { cloudflareId: string } & Omit<ComponentPropsWithoutRef<typeof Image>, "src" | "loader">) {
    return <Image alt={alt ?? ""} src={cloudflareId} loader={cloudflareImageLoader} {...props} />
}
