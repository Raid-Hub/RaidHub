import "server-only"

import type { BungieFetchConfig } from "bungie-net-core"
import type { PlatformErrorCodes } from "bungie-net-core/models"
import { BungieAPIError } from "~/models/BungieAPIError"
import BaseBungieClient from "~/services/bungie/BungieClient"
import { reactDedupe } from "~/util/react-cache"

const ExpectedErrorCodes = new Set<PlatformErrorCodes>([
    5, // SystemDisabled
    622 // GroupNotFound
])

export default class ServerBungieClient extends BaseBungieClient {
    private next: NextFetchRequestConfig

    constructor(next: NextFetchRequestConfig = {}) {
        super()
        this.next = next
    }

    generatePayload(config: BungieFetchConfig): RequestInit {
        if (config.url.pathname.match(/\/common\/destiny2_content\/json\//)) {
            throw new Error("Manifest definitions are not available on the server")
        }

        const apiKey = process.env.BUNGIE_API_KEY
        if (!apiKey) {
            throw new Error("Missing BUNGIE_API_KEY")
        }

        const payload: RequestInit & { headers: Headers } = {
            method: config.method,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            body: config.body,
            headers: new Headers(config.headers),
            next: this.next
        }

        payload.headers.set("X-API-KEY", apiKey)
        payload.headers.set(
            "Origin",
            process.env.DEPLOY_URL ??
                (process.env.VERCEL_URL
                    ? `https://${process.env.VERCEL_URL}`
                    : `https://localhost:${process.env.PORT ?? 3000}`)
        )

        const controller = new AbortController()
        payload.signal = controller.signal
        setTimeout(() => controller.abort(), 5000)

        return payload
    }

    async handle<T>(url: URL, payload: RequestInit): Promise<T> {
        try {
            return (await reactDedupe(this.request).call(this, url, payload)) as T
        } catch (e) {
            if (!(e instanceof BungieAPIError && ExpectedErrorCodes.has(e.ErrorCode))) {
                console.error(e)
            }
            throw e
        }
    }
}
