import "server-only"

import { BungieFetchConfig } from "bungie-net-core"
import { PlatformErrorCodes } from "bungie-net-core/models"
import { BungieAPIError } from "~/models/BungieAPIError"
import BaseBungieClient from "~/services/bungie/BungieClient"

const ExpectedErrorCodes = new Set<PlatformErrorCodes>([
    622 // GroupNotFound
])

export default class ServerBungieClient extends BaseBungieClient {
    private next: NextFetchRequestConfig

    constructor(next: NextFetchRequestConfig) {
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
            body: config.body,
            headers: new Headers(config.headers) ?? {},
            next: this.next
        }

        payload.headers.set("X-API-KEY", apiKey)
        payload.headers.set("Origin", process.env.VERCEL_URL ?? "https://localhost:3000")

        const controller = new AbortController()
        payload.signal = controller.signal

        setTimeout(() => controller.abort(), 2000)

        return payload
    }

    handle<T>(url: URL, payload: RequestInit): Promise<T> {
        try {
            return this.request(url, payload)
        } catch (e) {
            if (!(e instanceof BungieAPIError) || !ExpectedErrorCodes.has(e.ErrorCode)) {
                console.error(e)
            }
            throw e
        }
    }
}
