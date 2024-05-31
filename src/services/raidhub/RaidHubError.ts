import { type RaidHubErrorCode } from "./types"

export class RaidHubError<T> extends Error {
    constructor(public code: RaidHubErrorCode, public body: T) {
        super(code)
    }
}
