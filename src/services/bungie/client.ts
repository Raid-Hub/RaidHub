import { NotConfiguredError } from "bungie-net-core"
import {
    BungieAPIError,
    BungieClientProtocol,
    BungieFetchConfig,
    BungieNetResponse
} from "bungie-net-core/lib/api"
import { PlatformErrorCodes } from "bungie-net-core/lib/models"

export default class BungieClient implements BungieClientProtocol {
    private accessToken: string | null = null
    async fetch<T>(config: BungieFetchConfig): Promise<BungieNetResponse<T>> {
        const apiKey = process.env.BUNGIE_API_KEY
        if (!apiKey) {
            throw new NotConfiguredError(["BUNGIE_API_KEY"])
        }

        let headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-API-KEY": apiKey
        }
        if (this.accessToken) {
            headers = {
                ...headers,
                Authorization: `Bearer ${this.accessToken}`
            }
        }

        const body = config.body ? JSON.stringify(config.body) : null

        const url = new URL(config.url)
        if (config.params)
            Object.entries(config.params)
                .filter(([_, value]) => !!value)
                .forEach(([key, value]) => url.searchParams.set(key, value))

        const payload = {
            method: config.method,
            body,
            headers
        }

        const request = async (retry?: boolean) => {
            if (retry) url.searchParams.set("retry", true.toString())
            const res = await fetch(url, payload)
            const data: BungieNetResponse<T> = await res.json()
            if (data.ErrorCode !== PlatformErrorCodes.Success || !res.ok) {
                throw new BungieAPIError(data)
            }
            return data
        }

        try {
            return await request()
        } catch {
            return await request(true)
        }
    }

    setToken(value: string) {
        this.accessToken = value
    }

    clearToken() {
        this.accessToken = null
    }
}
