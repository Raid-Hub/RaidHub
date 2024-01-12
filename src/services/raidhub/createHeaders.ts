export function createHeaders(server: boolean?): HeadersInit | undefined {
    if (server) return { "x-api-key": process.env.RAIDHUB_API_KEY_SERVER }
    return process.env.RAIDHUB_API_KEY ? { "x-api-key": process.env.RAIDHUB_API_KEY } : undefined
}
