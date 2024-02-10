"use client"

import { BungieFetchConfig } from "bungie-net-core"
import { ReactNode, createContext, useContext, useState } from "react"
import BaseBungieClient from "~/services/bungie/BungieClient"

const BungieClientContext = createContext<ClientBungieClient | undefined>(undefined)

export const BungieClientProvider = (props: { children: ReactNode }) => {
    const [bungieClient] = useState(() => new ClientBungieClient())
    return (
        <BungieClientContext.Provider value={bungieClient}>
            {props.children}
        </BungieClientContext.Provider>
    )
}

export const useBungieClient = () => {
    const ctx = useContext(BungieClientContext)
    if (!ctx) throw Error("Cannot use useBungieClient outside a child of BungieClientProvider")
    return ctx
}

class ClientBungieClient extends BaseBungieClient {
    private accessToken: string | null = null

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

    protected handle<T>(url: URL, payload: RequestInit): Promise<T> {
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
    public readonly getToken = () => {
        return this.accessToken
    }

    /**
     * Sets the access token.
     * @param value The access token value.
     */
    public readonly setToken = (value: string) => {
        this.accessToken = value
    }

    /**
     * Clears the access token.
     */
    public readonly clearToken = () => {
        this.accessToken = null
    }
}
