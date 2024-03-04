import "server-only"
export async function getYoutubeProfile(access_token: string) {
    const url = new URL("https://www.googleapis.com/youtube/v3/channels")
    url.searchParams.set("part", "snippet")
    url.searchParams.set("mine", "true")

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    const data = (await res.json()) as {
        items?: {
            kind: string
            etag: string
            id: string
            snippet: {
                title: string
                description: string
                customUrl?: string
                publishedAt: string
                thumbnails: { default: object; medium: object; high: object }
                localized: {
                    title: string
                    description: string
                }
                country: string
            }
        }[]
    }

    if (!res.ok) {
        throw data
    } else {
        const items = data.items
        if (items?.length) {
            return items[0]
        } else {
            throw new Error("Not found")
        }
    }
}
