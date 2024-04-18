import Image, { type ImageLoader } from "next/image"
import { type ComponentPropsWithoutRef } from "react"
import { R2RaidSplash } from "~/data/activity-images"

export const cloudflareImageLoader: ImageLoader = ({ src: id, width, quality }) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const minWidth = (width * (quality || 75)) / 100

    const img = CloudflareImages[id as keyof typeof CloudflareImages]

    const variants = cloudflareVariants.filter(item => item.name in img.variants)
    const variant = (variants.find(item => item.w >= minWidth) ?? variants[variants.length - 1])
        .name

    return `https://cdn.raidhub.io/content/${img.path}/${
        img.variants[variant as keyof typeof img.variants]
    }`
}

export const CloudflareImage = ({
    cloudflareId,
    alt = "",
    ...props
}: { cloudflareId: keyof typeof CloudflareImages } & Omit<
    ComponentPropsWithoutRef<typeof Image>,
    "src" | "loader"
>) => <Image loader={cloudflareImageLoader} {...props} src={cloudflareId} alt={alt} />

const CloudflareImages = {
    raidhubCitySplash: {
        path: "splash/raidhub/city",
        variants: {
            tiny: "tiny.avif",
            small: "small.avif",
            medium: "medium.avif",
            large: "large.avif"
        }
    },
    pantheonSplash: {
        path: "splash/pantheon",
        variants: {
            small: "small.png",
            large: "large.png"
        }
    },
    ...R2RaidSplash
} as const satisfies Record<
    string,
    { path: string; variants: Partial<Record<(typeof cloudflareVariants)[number]["name"], string>> }
>

export type CloudflareImageId = keyof typeof CloudflareImages

const cloudflareVariants = [
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
] as const satisfies { name: string; w: number; h: number }[]
