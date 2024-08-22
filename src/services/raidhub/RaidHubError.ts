import {
    type RaidHubAPIErrorResponse,
    type RaidHubErrorCode,
    type RaidHubErrorSchema
} from "./types"

export class RaidHubError<T extends RaidHubErrorCode> extends Error {
    readonly errorCode: RaidHubErrorCode
    readonly cause: RaidHubErrorSchema<T>

    constructor(res: RaidHubAPIErrorResponse<T>) {
        super(res.code)
        this.errorCode = res.code
        this.cause = res.error
    }
}
