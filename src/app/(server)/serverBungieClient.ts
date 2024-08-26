import "server-only"

import type { BungieFetchConfig } from "bungie-net-core"
import type { PlatformErrorCodes } from "bungie-net-core/models"
import { BungieAPIError } from "~/models/BungieAPIError"
import BaseBungieClient from "~/services/bungie/BungieClient"
import { baseUrl } from "./util"

const ExpectedErrorCodes = new Set<PlatformErrorCodes>([
    5, // SystemDisabled
    686, // ClanNotFound
    1653 // PGCRNotFound
])

export default class ServerBungieClient extends BaseBungieClient {
    private next: NextFetchRequestConfig
    private timeout: number
    private cache?: RequestCache

    constructor({
        next,
        timeout,
        cache
    }: { next?: NextFetchRequestConfig; timeout?: number; cache?: RequestCache } = {}) {
        super()
        this.next = next ?? {}
        this.timeout = timeout ?? 5000
        this.cache = cache
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
            next: this.next,
            cache: this.cache
        }

        payload.headers.set("X-API-KEY", apiKey)
        payload.headers.set("Origin", baseUrl)

        const controller = new AbortController()
        payload.signal = controller.signal
        setTimeout(() => controller.abort(), this.timeout)

        return payload
    }

    async handle<T>(url: URL, payload: RequestInit): Promise<T> {
        try {
            return (await this.request(url, payload)) as T
        } catch (err) {
            if (
                !(err instanceof DOMException) &&
                !(err instanceof BungieAPIError && ExpectedErrorCodes.has(err.ErrorCode))
            ) {
                console.error(err)
            }
            throw err
        }
    }
}
