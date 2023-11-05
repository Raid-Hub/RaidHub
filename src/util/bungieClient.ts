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

const DONT_RETRY_CODES: PlatformErrorCodes[] = [
    217, //PlatformErrorCodes.UserCannotResolveCentralAccount
    5, //PlatformErrorCodes.SystemDisabled
    622, //PlatformErrorCodes.GroupNotFound,
    1653 // DestinyPGCRNotFound
]

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

        const request = async (retry?: boolean) => {
            const controller = new AbortController()
            const timer = setTimeout(() => controller.abort(), 5000)
            payload.signal = controller.signal

            if (retry) config.url.searchParams.set("retry", true.toString())
            const res = await fetch(config.url, payload)
            const data = await res.json()
            clearTimeout(timer)

            if (data.ErrorCode && data.ErrorCode !== 1) {
                throw new BungieAPIError(data)
            } else if (!res.ok) {
                throw Error("Error parsing response")
            }
            return data as T
        }

        try {
            return await request()
        } catch (e) {
            if (e instanceof BungieAPIError && !DONT_RETRY_CODES.includes(e.ErrorCode)) {
                return await request(true)
            } else {
                throw e
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
