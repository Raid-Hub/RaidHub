import {
    type RaidHubAPIErrorResponse,
    type RaidHubErrorCode,
    type RaidHubErrorSchema
} from "./types"

export class RaidHubError extends Error {
    readonly errorCode: RaidHubErrorCode
    readonly cause: RaidHubErrorSchema<RaidHubErrorCode>

    constructor(res: RaidHubAPIErrorResponse<RaidHubErrorCode>) {
        super(res.code)
        this.errorCode = res.code
        this.cause = res.error
    }
}
