import { BungieClientProtocol, BungieFetchConfig } from "bungie-net-core"
import { BungieAPIError } from "~/models/BungieAPIError"

/**
 * Represents a client for interacting with the Bungie API.
 */
export default abstract class BaseBungieClient implements BungieClientProtocol {
    /**
     * Makes a fetch request to the Bungie API.
     * @param config The fetch configuration.
     * @returns A promise that resolves to the response data.
     */
    public readonly fetch = async <T>(config: BungieFetchConfig): Promise<T> => {
        const payload = this.generatePayload(config)
        return this.handle(config.url, payload)
    }

    /**
     * Sends a request to the specified URL with the given payload.
     * @param url The URL to send the request to.
     * @param payload The request payload.
     * @returns A promise that resolves to the response data.
     */
    protected readonly request = async <T>(url: URL, payload: RequestInit): Promise<T> => {
        const res = await fetch(url, payload)
        const data = await res.json()

        if (data.ErrorCode && data.ErrorCode !== 1) {
            throw new BungieAPIError(data)
        } else if (!res.ok) {
            const error = new Error("Error fetching data")
            throw Object.assign(error, data)
        }

        return data as T
    }

    /**
     * Generates the payload for the fetch request.
     * @param config The fetch configuration.
     * @returns The generated payload.
     * @protected This method can be overridden in derived classes.
     */
    protected abstract generatePayload(config: BungieFetchConfig): RequestInit

    /**
     * Handles the fetch request by making the request and handling errors.
     * It shoulddelegate to the `request` method to make the request.
     * This is where retries and other custom error handling should be implemented.
     * @param url The URL to send the request to.
     * @param payload The request payload.
     * @returns A promise that resolves to the response data.
     * @protected This method can be overridden in derived classes.
     */
    protected abstract handle<T>(url: URL, payload: RequestInit): Promise<T>
}
