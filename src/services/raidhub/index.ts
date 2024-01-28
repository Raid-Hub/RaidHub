import { RaidHubAPIResponse } from "~/types/raidhub-api"
import { paths } from "~/types/raidhub-openapi"

export async function getRaidhubApi<
    T extends keyof paths,
    _M = "get" extends keyof paths[T] ? paths[T]["get"] : null,
    _R = "responses" extends keyof _M ? _M["responses"] : null,
    _200 = 200 extends keyof _R ? _R[200] : null,
    _C = "content" extends keyof _200 ? _200["content"] : null,
    R = "application/json" extends keyof _C ? _C["application/json"] : never,
    _P = "parameters" extends keyof _M ? _M["parameters"] : null
>(path: T, query: "query" extends keyof _P ? _P["query"] : null): Promise<R> {
    const url = new URL(path, process.env.RAIDHUB_API_URL!)
    Object.entries(query ?? {}).forEach(([key, value]) => {
        url.searchParams.set(key, String(value))
    })

    return fetchRaidHub<R>(url, { headers: createHeaders(), method: "GET" })
}

export async function postRaidhubApi<
    T extends keyof paths,
    _M = "post" extends keyof paths[T] ? paths[T]["post"] : null,
    _R = "responses" extends keyof _M ? _M["responses"] : null,
    _200 = 200 extends keyof _R ? _R[200] : null,
    _C = "content" extends keyof _200 ? _200["content"] : null,
    R = "application/json" extends keyof _C ? _C["application/json"] : never,
    _P = "parameters" extends keyof _M ? _M["parameters"] : null,
    _RB = "requestBody" extends keyof _M ? _M["requestBody"][] : null,
    _RC = "content" extends keyof _RB ? _RB["content"] : null
>(
    path: T,
    query: "query" extends keyof _P ? _P["query"] : null,
    body: "application/json" extends keyof _RC ? _RC["application/json"] : null
): Promise<R> {
    // create url
    const url = new URL(path, process.env.RAIDHUB_API_URL!)
    Object.entries(query ?? {}).forEach(([key, value]) => {
        url.searchParams.set(key, String(value))
    })

    return fetchRaidHub<R>(url, {
        headers: { ...createHeaders(), "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body)
    })
}

function createHeaders(): HeadersInit | undefined {
    // Server side, we use the private server key, which is undefined client side
    const apiKey = process.env.RAIDHUB_API_KEY_SERVER || process.env.RAIDHUB_API_KEY
    return apiKey ? { "x-api-key": apiKey } : undefined
}

async function fetchRaidHub<R>(url: URL, init: RequestInit) {
    const res = await fetch(url, init)

    let data: RaidHubAPIResponse<R>
    try {
        data = (await res.json()) as RaidHubAPIResponse<R>
    } catch (err) {
        if (!res.ok) {
            throw new Error("RaidHub API returned " + res.status)
        } else {
            throw err
        }
    }

    if (data.success) {
        return data.response
    } else {
        const err = new Error(data.message)
        Object.assign(err, data.error)
        throw err
    }
}
