import { BungieClientProtocol, BungieFetchConfig } from "bungie-net-core"
import { BungieAPIError } from "~/models/BungieAPIError"

/**
 * Represents a client for interacting with the Bungie API.
 */
export default class BungieClient implements BungieClientProtocol {
    private accessToken: string | null = null

    /**
     * Makes a fetch request to the Bungie API.
     * @param config The fetch configuration.
     * @returns A promise that resolves to the response data.
     */
    public readonly fetch = async <T>(config: BungieFetchConfig): Promise<T> => {
        const payload = this.generatePayload(config)
        return this.handle(config.url, payload)
    }

    /**
     * Sends a request to the specified URL with the given payload.
     * @param url The URL to send the request to.
     * @param payload The request payload.
     * @returns A promise that resolves to the response data.
     */
    protected readonly request = async <T>(url: URL, payload: RequestInit): Promise<T> => {
        const res = await fetch(url, payload)
        const data = await res.json()

        if (data.ErrorCode && data.ErrorCode !== 1) {
            throw new BungieAPIError(data)
        } else if (!res.ok) {
            throw Error("Error parsing response")
        }

        return data as T
    }

    /**
     * Generates the payload for the fetch request.
     * @param config The fetch configuration.
     * @returns The generated payload.
     * @throws Error if BUNGIE_API_KEY is missing.
     * @protected This method can be overridden in derived classes.
     */
    protected generatePayload(config: BungieFetchConfig): RequestInit {
        const apiKey = process.env.BUNGIE_API_KEY
        if (!apiKey) {
            throw new Error("Missing BUNGIE_API_KEY")
        }

        const payload: RequestInit & { headers: Record<string, string> } = {
            method: config.method,
            body: config.body,
            headers: config.headers ?? {}
        }

        if (config.url.pathname.match(/\/Platform\//)) {
            payload.headers["X-API-KEY"] = apiKey

            if (this.accessToken) {
                payload.headers["Authorization"] = `Bearer ${this.accessToken}`
            }
        }

        const controller = new AbortController()
        payload.signal = controller.signal

        if (config.url.pathname.match(/\/PostGameCarnageReport\//)) {
            setTimeout(() => controller.abort(), 3000)
        }

        return payload
    }

    /**
     * Handles the fetch request by making the request and handling errors.
     * @param url The URL to send the request to.
     * @param payload The request payload.
     * @returns A promise that resolves to the response data.
     * @protected This method can be overridden in derived classes.
     */
    protected async handle<T>(url: URL, payload: RequestInit): Promise<T> {
        try {
            return this.request(url, payload)
        } catch (e) {
            if (url.pathname.match(/\/common\/destiny2_content\/json\//)) {
                url.searchParams.set("retry", String(Math.floor(Math.random() * 7777777)))
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
    getToken() {
        return this.accessToken
    }

    /**
     * Sets the access token.
     * @param value The access token value.
     */
    setToken(value: string) {
        this.accessToken = value
    }

    /**
     * Clears the access token.
     */
    clearToken() {
        this.accessToken = null
    }
}
