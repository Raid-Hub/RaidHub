import type { BungieFetchConfig } from "bungie-net-core"
import { BungieAPIError } from "~/models/BungieAPIError"
import BaseBungieClient from "~/services/bungie/BungieClient"

export default class ClientBungieClient extends BaseBungieClient {
    private accessToken: string | null = null
    // An interval to clear the access token.
    private tokenClearTimeout: NodeJS.Timeout | null = null

    protected generatePayload(config: BungieFetchConfig): RequestInit {
        const apiKey = process.env.BUNGIE_API_KEY
        if (!apiKey) {
            throw new Error("Missing BUNGIE_API_KEY")
        }

        const payload: RequestInit & { headers: Headers } = {
            method: config.method,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            body: config.body,
            headers: new Headers(config.headers ?? {})
        }

        if (config.url.pathname.match(/\/Platform\//)) {
            payload.headers.set("X-API-KEY", apiKey)

            if (this.accessToken) {
                payload.headers.set("Authorization", `Bearer ${this.accessToken}`)
            }
        }

        const controller = new AbortController()
        payload.signal = controller.signal

        if (config.url.pathname.match(/\/PostGameCarnageReport\//)) {
            setTimeout(() => controller.abort(), 3000)
        }

        return payload
    }

    protected async handle<T>(url: URL, payload: RequestInit): Promise<T> {
        try {
            return await this.request(url, payload)
        } catch (e) {
            if (url.pathname.match(/\/common\/destiny2_content\/json\//)) {
                url.searchParams.set("bust", String(Math.floor(Math.random() * 7777777)))
                return this.request(url, payload)
            } else if (e instanceof BungieAPIError && e.ErrorCode === 1688) {
                url.searchParams.set("retry", "DestinyDirectBabelClientTimeout")
                return this.request(url, payload)
            } else {
                throw e
            }
        }
    }

    /**
     * Gets the current access token.
     * @returns The access token.
     */
    public readonly getToken = () => {
        return this.accessToken
    }

    /**
     * Sets the access token.
     * @param token.value The access token value.
     * @param token.expires The expiration date of the access token.
     */
    public readonly setToken = (token: { value: string; expires: Date }) => {
        if (this.tokenClearTimeout) {
            clearTimeout(this.tokenClearTimeout)
        }
        this.accessToken = token.value
        this.tokenClearTimeout = setTimeout(() => {
            this.accessToken = null
        }, token.expires.getTime() - Date.now())
    }

    /**
     * Clears the access token.
     */
    public readonly clearToken = () => {
        this.accessToken = null
        if (this.tokenClearTimeout) {
            clearTimeout(this.tokenClearTimeout)
        }
    }
}
