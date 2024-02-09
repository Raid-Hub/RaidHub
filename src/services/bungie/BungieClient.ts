import { BungieClientProtocol, BungieFetchConfig } from "bungie-net-core"
import { BungieAPIError } from "~/models/BungieAPIError"

export default class BungieClient implements BungieClientProtocol {
    private accessToken: string | null = null

    async fetch<T>(config: BungieFetchConfig): Promise<T> {
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
        let timer = null

        if (config.url.pathname.match(/\/PostGameCarnageReport\//)) {
            timer = setTimeout(() => controller.abort(), 3000)
        }

        const request = async (opts?: { cacheBust?: true }) => {
            if (opts?.cacheBust)
                config.url.searchParams.set("retry", String(Math.floor(Math.random() * 7777777)))
            const res = await fetch(config.url, payload)
            const data = await res.json()

            if (data.ErrorCode && data.ErrorCode !== 1) {
                throw new BungieAPIError(data)
            } else if (!res.ok) {
                throw Error("Error parsing response")
            }

            return data as T
        }

        try {
            return request()
        } catch (e) {
            if (config.url.pathname.match(/\/common\/destiny2_content\/json\//)) {
                return request({ cacheBust: true })
            } else {
                throw e
            }
        } finally {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }

    getToken() {
        return this.accessToken
    }

    setToken(value: string) {
        this.accessToken = value
    }

    clearToken() {
        this.accessToken = null
    }
}
