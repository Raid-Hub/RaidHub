import type { BungieNetResponse } from "bungie-net-core/models"

export class BungieAPIError extends Error {
    public readonly cause: Omit<BungieNetResponse<unknown>, "Response">

    constructor(response: BungieNetResponse<unknown>) {
        super(response.Message)
        this.name = "BungieAPIError"
        this.cause = response
    }

    get ErrorCode() {
        return this.cause.ErrorCode
    }
}
