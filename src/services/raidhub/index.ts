import type { Prettify } from "~/types/generic"
import type { RaidHubAPIResponse, RaidHubPath } from "~/types/raidhub-api"
import type { paths } from "~/types/raidhub-openapi"

export async function getRaidHubApi<
    T extends RaidHubPath,
    _M = "get" extends keyof paths[T] ? paths[T]["get"] : never,
    _R = "responses" extends keyof _M ? _M["responses"] : never,
    _200 = 200 extends keyof _R ? _R[200] : never,
    _C = "content" extends keyof _200 ? _200["content"] : never,
    R = "application/json" extends keyof _C ? _C["application/json"] : null,
    _P = "parameters" extends keyof _M ? _M["parameters"] : null
>(
    path: T,
    pathParams: "path" extends keyof _P ? _P["path"] : null,
    queryParams: "query" extends keyof _P ? _P["query"] : null,
    config?: Omit<RequestInit, "method" | "body">
): Promise<Prettify<R>> {
    const url = new URL(
        path.replace(/{([^}]+)}/g, (_, paramName) => {
            // @ts-expect-error types don't really work here
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return pathParams[paramName]
        }),
        process.env.RAIDHUB_API_URL
    )
    Object.entries(queryParams ?? {}).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, String(value))
    })

    return fetchRaidHub<R>(url, {
        ...config,
        headers: createHeaders(config?.headers),
        method: "GET"
    })
}

export async function postRaidHubApi<
    T extends keyof paths,
    _M = "post" extends keyof paths[T] ? paths[T]["post"] : never,
    _P = "parameters" extends keyof _M ? _M["parameters"] : null,
    _RB = "requestBody" extends keyof _M ? Exclude<_M["requestBody"], undefined> : null,
    _RC = "content" extends keyof _RB ? _RB["content"] : null,
    _R = "responses" extends keyof _M ? _M["responses"] : never,
    _200 = 200 extends keyof _R ? _R[200] : null,
    _C = "content" extends keyof _200 ? _200["content"] : null,
    R = "application/json" extends keyof _C ? _C["application/json"] : never
>(
    path: T,
    query: "query" extends keyof _P ? _P["query"] : null,
    body: "application/json" extends keyof _RC ? _RC["application/json"] : null,
    config?: Omit<RequestInit, "method" | "body">
): Promise<Prettify<R>> {
    // create url
    const url = new URL(path, process.env.RAIDHUB_API_URL)
    Object.entries(query ?? {}).forEach(([key, value]) => {
        url.searchParams.set(key, String(value))
    })

    return fetchRaidHub<R>(url, {
        ...config,
        headers: createHeaders({ "Content-Type": "application/json", ...config?.headers }),
        method: "POST",
        body: JSON.stringify(body)
    })
}

function createHeaders(init?: HeadersInit) {
    const headers = new Headers(init)
    // Server side, we use the private server key, which is undefined client side
    const apiKey = process.env.RAIDHUB_API_KEY_SERVER ?? process.env.RAIDHUB_API_KEY
    if (apiKey) {
        headers.set("x-api-key", apiKey)
    }
    return headers
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
