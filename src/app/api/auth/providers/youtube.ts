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

    const data = await res.json()
    if (!res.ok) {
        throw data
    } else {
        const items = data.items as
            | {
                  kind: string
                  etag: string
                  id: string
                  snippet: {
                      title: string
                      description: string
                      customUrl?: string
                      publishedAt: string
                      thumbnails: { default: Object; medium: Object; high: Object }
                      localized: {
                          title: string
                          description: string
                      }
                      country: string
                  }
              }[]
            | undefined

        if (items && items.length) {
            return items[0]
        } else {
            throw new Error("Not found")
        }
    }
}
