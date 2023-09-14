import { BungieClientProtocol, BungieFetchConfig } from "bungie-net-core"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import { PlatformErrorCodes } from "bungie-net-core/models"
import BungieQuery, { QueryFn } from "./bungieClientQuery"
import { getProfile } from "../services/bungie/getProfile"
import { getPGCR } from "../services/bungie/getPGCR"
import { getActivityHistory } from "../services/bungie/getActivityHistory"
import { getClan, getClanForMember, getClanMembers } from "../services/bungie/getClan"
import { getLinkedProfiles } from "../services/bungie/getLinkedProfiles"
import { QueryClient } from "@tanstack/react-query"
import { getDestinyStatsForCharacter } from "~/services/bungie/getDestinyStatsForCharacter"
import { getDestinyStats } from "~/services/bungie/getDestinyStats"
import { getProfileTransitory } from "~/services/bungie/getProfileTransitory"

const DONT_RETRY_CODES: PlatformErrorCodes[] = [
    217, //PlatformErrorCodes.UserCannotResolveCentralAccount
    5, //PlatformErrorCodes.SystemDisabled
    622 //PlatformErrorCodes.GroupNotFound
]

export default class BungieClient implements BungieClientProtocol {
    private accessToken: string | null = null
    queryClient: QueryClient

    constructor(queryClient: QueryClient) {
        this.queryClient = queryClient
    }

    async fetch<T>(config: BungieFetchConfig): Promise<T> {
        const apiKey = process.env.BUNGIE_API_KEY
        if (!apiKey) {
            throw new Error("Missing BUNGIE_API_KEY")
        }

        const payload = {
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

    getToken() {
        return this.accessToken
    }

    setToken(value: string) {
        this.accessToken = value
    }

    clearToken() {
        this.accessToken = null
    }

    private query<TParams, TData>(queryFn: (client: BungieClient) => QueryFn<TParams, TData>) {
        return BungieQuery(this, queryFn(this))
    }

    clan = {
        byMember: this.query(getClanForMember),
        byId: this.query(getClan),
        members: this.query(getClanMembers)
    }
    profile = this.query(getProfile)
    profileTransitory = this.query(getProfileTransitory)
    pgcr = this.query(getPGCR)
    activityHistory = this.query(getActivityHistory)
    linkedProfiles = this.query(getLinkedProfiles)
    stats = this.query(getDestinyStats)
    characterStats = this.query(getDestinyStatsForCharacter)
}
