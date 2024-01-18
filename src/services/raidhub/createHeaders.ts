export function createHeaders(server?: boolean): HeadersInit | undefined {
    const apiKey = server ? process.env.RAIDHUB_API_KEY_SERVER : process.env.RAIDHUB_API_KEY
    return apiKey ? { "x-api-key": apiKey } : undefined
}
