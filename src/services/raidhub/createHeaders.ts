export function createHeaders(): HeadersInit | undefined {
    return process.env.RAIDHUB_API_KEY ? { "x-api-key": process.env.RAIDHUB_API_KEY } : undefined
}
