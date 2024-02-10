import { BungieFetchConfig } from "bungie-net-core"
import "server-only"
import BungieClient from "~/services/bungie/BungieClient"

export default class ServerBungieClient extends BungieClient {
    private next: NextFetchRequestConfig

    constructor(next: NextFetchRequestConfig) {
        super()
        this.next = next
    }

    /**
     * @override
     */
    generatePayload(config: BungieFetchConfig): RequestInit {
        if (config.url.pathname.match(/\/common\/destiny2_content\/json\//)) {
            throw new Error("Manifest definitions are not available on the server")
        }

        const apiKey = process.env.BUNGIE_API_KEY
        if (!apiKey) {
            throw new Error("Missing BUNGIE_API_KEY")
        }

        const payload: RequestInit & { headers: Record<string, string> } = {
            method: config.method,
            body: config.body,
            headers: config.headers ?? {},
            next: this.next
        }

        payload.headers["X-API-KEY"] = apiKey
        payload.headers["Origin"] = process.env.VERCEL_URL ?? "https://localhost:3000"

        const controller = new AbortController()
        payload.signal = controller.signal

        setTimeout(() => controller.abort(), 2000)

        return payload
    }

    /**
     * @override
     * @throws Error if the request times out.
     */
    async handle<T>(url: URL, payload: RequestInit): Promise<T> {
        try {
            return this.request(url, payload)
        } catch (e) {
            if ((e as Error).name === "AbortError") {
                throw new Error("Request timed out")
            }
            console.error(e)
            throw e
        }
    }
}
