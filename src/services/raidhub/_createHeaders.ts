export function createHeaders(): HeadersInit | undefined {
    // Server side, we use the private server key, which is undefined client side
    const apiKey = process.env.RAIDHUB_API_KEY_SERVER || process.env.RAIDHUB_API_KEY
    return apiKey ? { "x-api-key": apiKey } : undefined
}
