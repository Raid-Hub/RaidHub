import { type RaidHubErrorCode } from "./types"

export class RaidHubError<T> extends Error {
    readonly errorCode: RaidHubErrorCode
    readonly body: T
    constructor(errorCode: RaidHubErrorCode, body: T) {
        super(errorCode)
        this.errorCode = errorCode
        this.body = body
    }
}
