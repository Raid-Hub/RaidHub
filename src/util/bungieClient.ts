import { BungieClientProtocol, BungieFetchConfig } from "bungie-net-core"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import { PlatformErrorCodes } from "bungie-net-core/models"
import BungieQuery, { QueryFn } from "./bungieQuery"
import { getProfile, getProfileTransitory } from "../services/bungie/getProfile"
import { getPGCR } from "../services/bungie/getPGCR"
import { getClan, getClanForMember, getClanMembers } from "../services/bungie/getClan"
import { getLinkedProfiles } from "../services/bungie/getLinkedProfiles"
import { QueryClient } from "@tanstack/react-query"
import { getDestinyStatsForCharacter } from "~/services/bungie/getDestinyStatsForCharacter"
import { getDestinyStats } from "~/services/bungie/getDestinyStats"

const DO_NOT_RETRY_CODES = new Set<PlatformErrorCodes>([
    5, // SystemDisabled
    217, // UserCannotResolveCentralAccount
    622, // GroupNotFound,
    1653 // DestinyPGCRNotFound
])

export default class BungieClient implements BungieClientProtocol {
    private accessToken: string | null = null
    private _queryClient: QueryClient

    constructor(queryClient: QueryClient) {
        this._queryClient = queryClient
    }

    get queryClient() {
        return this._queryClient
    }

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

        const request = async (opts?: { retry?: boolean; cacheBust?: true }) => {
            if (opts?.retry) config.url.searchParams.set("retry", "true")
            if (opts?.cacheBust)
                config.url.searchParams.set(
                    "cacheBust",
                    String(Math.floor(Math.random() * 7777777))
                )
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
            if (e instanceof BungieAPIError && !DO_NOT_RETRY_CODES.has(e.ErrorCode)) {
                return request({ retry: true })
            } else if (config.url.pathname.match(/\/common\/destiny2_content\/json\//)) {
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

    private query<TParams, TData>({
        fn,
        key
    }: {
        fn: (client: BungieClientProtocol) => QueryFn<TParams, TData>
        key: string
    }) {
        return BungieQuery<TParams, TData>(this, fn(this), key)
    }

    clan = {
        byMember: this.query(getClanForMember),
        byId: this.query(getClan),
        members: this.query(getClanMembers)
    }
    // we prefetch the profile missing some components
    profile = this.query(getProfile)
    profileTransitory = this.query(getProfileTransitory)
    pgcr = this.query(getPGCR)
    linkedProfiles = this.query(getLinkedProfiles)
    stats = this.query(getDestinyStats)
    characterStats = this.query(getDestinyStatsForCharacter)
}
