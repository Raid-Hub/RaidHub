import { BungieClientProtocol, BungieFetchConfig } from "bungie-net-core"
import { BungieAPIError } from "@/models/errors/BungieAPIError"

const DONT_RETRY_CODES = [
    217, //PlatformErrorCodes.UserCannotResolveCentralAccount,
    5 //PlatformErrorCodes.SystemDisabled
]

export default class BungieClient implements BungieClientProtocol {
    private accessToken: string | null = null
    async fetch<T>(config: BungieFetchConfig): Promise<T> {
        const apiKey = process.env.BUNGIE_API_KEY
        if (!apiKey) {
            throw new Error("Missing BUNGIE_API_KEY")
        }
        const headers: Record<string, string> = {
            ...config.headers,
            "X-API-KEY": apiKey
        }

        if (this.accessToken) {
            headers["Authorization"] = `Bearer ${this.accessToken}`
        }

        const payload = {
            method: config.method,
            body: config.body,
            headers
        }

        const request = async (retry?: boolean) => {
            if (retry) config.url.searchParams.set("retry", true.toString())
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
            return await request()
        } catch (e: any) {
            if (DONT_RETRY_CODES.includes(e.ErrorCode)) {
                throw e
            } else {
                return await request(true)
            }
        }
    }

    setToken(value: string) {
        this.accessToken = value
    }

    clearToken() {
        this.accessToken = null
    }
}
